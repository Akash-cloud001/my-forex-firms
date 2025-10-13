import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import EmailSubscription from "@/models/EmailSubscription";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    
    // Date range filters
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Connect to MongoDB
    await connectDB();

    // Build query
    const query: Record<string, unknown> = {};
    
    // Search filter (email)
    if (search) {
      query.email = { $regex: search, $options: "i" };
    }
    
    // Date range filter
    if (startDate || endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.$lte = new Date(endDate);
      }
      query.createdAt = dateFilter;
    }

    // Get total count for pagination
    const total = await EmailSubscription.countDocuments(query);
    
    // Fetch subscriptions with pagination and sorting
    const subscriptions = await EmailSubscription.find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get statistics
    const stats = await getSubscriptionStats();

    return NextResponse.json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching newsletter subscriptions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch subscriptions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper function to get subscription statistics
async function getSubscriptionStats() {
  try {
    await connectDB();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalCount, todayCount, weekCount, monthCount, recentSubscriptions] = await Promise.all([
      EmailSubscription.countDocuments(),
      EmailSubscription.countDocuments({ createdAt: { $gte: today } }),
      EmailSubscription.countDocuments({ createdAt: { $gte: thisWeek } }),
      EmailSubscription.countDocuments({ createdAt: { $gte: thisMonth } }),
      EmailSubscription.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 30 },
      ]),
    ]);

    return {
      total: totalCount,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount,
      recentTrend: recentSubscriptions.map((item) => ({
        date: item._id,
        count: item.count,
      })),
    };
  } catch (error) {
    console.error("Error getting subscription stats:", error);
    return {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      recentTrend: [],
    };
  }
}

// Export individual subscription by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await EmailSubscription.findOneAndDelete({
      email: email.toLowerCase(),
    });

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete subscription",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Bulk operations
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, emails } = body;

    await connectDB();

    switch (action) {
      case "bulk-delete":
        if (!Array.isArray(emails) || emails.length === 0) {
          return NextResponse.json(
            { success: false, message: "Emails array is required" },
            { status: 400 }
          );
        }

        const deleteResult = await EmailSubscription.deleteMany({
          email: { $in: emails.map((e: string) => e.toLowerCase()) },
        });

        return NextResponse.json({
          success: true,
          message: `${deleteResult.deletedCount} subscriptions deleted`,
          deletedCount: deleteResult.deletedCount,
        });

      case "export":
        const allSubscriptions = await EmailSubscription.find({})
          .sort({ createdAt: -1 })
          .lean();

        return NextResponse.json({
          success: true,
          data: allSubscriptions,
        });

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in POST operation:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to perform operation",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

