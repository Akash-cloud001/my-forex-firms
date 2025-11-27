"use client"
import { useEffect, useState } from "react";
import { CategoryFormData, FaqFormData, IFaq, IFaqCategory } from "./type";
import { Button } from "@/components/ui/button";
import { Edit2, FolderPlus, Loader2, Plus, Search } from "lucide-react";
import { CategoryListItem } from "./CategoryListItem";
import { Input } from "@/components/ui/input";
import { FaqCard } from "./FaqCard";
import { FaqModal } from "./FaqModal";
import { CategoryModal } from "./CategoryModal";
import { createCategory, createFaq, deleteCategory, deleteFaq, getAllCategories, getCategoryWithFaqs, updateCategory, updateFaq } from "@/services/faqServices";

export default function FAQAdminPanel() {
  const [categories, setCategories] = useState<(IFaqCategory & { faqs: IFaq[] })[]>([

  ]);
  const [loading, setLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    data?: Partial<CategoryFormData>;
  }>({ isOpen: false, mode: 'create' });
  const [faqModal, setFaqModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    data?: Partial<FaqFormData>;
    faqId?: string;
  }>({ isOpen: false, mode: 'create' });
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch FAQs when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      fetchCategoryWithFaqs(selectedCategoryId);
    }
  }, [selectedCategoryId]);


  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      const categoriesWithFaqs = data.map((cat) => ({ ...cat, faqs: [] }));
      setCategories(categoriesWithFaqs);
      if (categoriesWithFaqs.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(categoriesWithFaqs[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryWithFaqs = async (categoryId: string) => {
    try {
      const data = await getCategoryWithFaqs(categoryId);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === categoryId ? data : cat))
      );
    } catch (error) {
      console.error("Failed to fetch category FAQs");
    }
  };



  const handleCategorySubmit = async (data: CategoryFormData) => {
    if (categoryModal.mode === "create") {
      const newCategory = await createCategory(data);
      setCategories((prev) => [...prev, { ...newCategory, faqs: [] }]);
      setSelectedCategoryId(newCategory._id);
    } else {
      const updated = await updateCategory(selectedCategoryId, data);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === selectedCategoryId ? { ...cat, ...updated } : cat))
      );
    }
  };

  const handleFaqSubmit = async (data: FaqFormData) => {
    if (faqModal.mode === "create") {
      const newFaq = await createFaq({
        ...data,
        categoryId: selectedCategoryId,
      });
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === selectedCategoryId
            ? { ...cat, faqs: [...cat.faqs, newFaq], totalFaq: (cat.totalFaq || 0) + 1 }
            : cat
        )
      );
    } else {
      const updated = await updateFaq(faqModal.faqId!, data);
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === selectedCategoryId
            ? {
              ...cat,
              faqs: cat.faqs.map((faq) =>
                faq._id === faqModal.faqId ? updated : faq
              ),
            }
            : cat
        )
      );
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    await deleteCategory(categoryId);
    setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(categories[0]?._id || "");
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    await deleteFaq(faqId);
    setCategories((prev) =>
      prev.map((cat) =>
        cat._id === selectedCategoryId
          ? { ...cat, faqs: cat.faqs.filter((faq) => faq._id !== faqId), totalFaq: Math.max(0, (cat.totalFaq || 0) - 1) }
          : cat
      )
    );
  };
  const currentCategory = categories.find((cat) => cat._id === selectedCategoryId);
  const displayFaqs =
    currentCategory?.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header */}
      <div className="">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                FAQ Management
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Create and organize your help center
              </p>
            </div>
            <Button
              onClick={() =>
                setCategoryModal({ isOpen: true, mode: 'create' })
              }
              className="bg-linear-to-r from-[#F66435] to-[#672611] hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              size="lg"
            >
              <FolderPlus className="w-5 h-5 mr-2" />
              New Category
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Categories Sidebar */}
          <div className="col-span-3">
            <div className="bg-card border border-border rounded-sm p-5 sticky top-24 shadow-sm">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
                Categories
              </h3>
              <div className="space-y-1.5">
                {categories.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No categories yet
                  </div>
                ) : (
                  categories.map((category) => (
                    <CategoryListItem
                      key={category._id}
                      category={category}
                      isSelected={selectedCategoryId === category._id}
                      faqCount={category.totalFaq ?? category.faqs.length}
                      onClick={() => setSelectedCategoryId(category._id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {currentCategory ? (
              <>
                {/* Category Header */}
                <div className="bg-card border border-border rounded-sm px-6 py-4 mb-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold text-foreground capitalize">
                        {currentCategory.name}
                      </h2>
                      {currentCategory.description && (
                        <p className="text-muted-foreground capitalize">
                          {currentCategory.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setCategoryModal({
                          isOpen: true,
                          mode: 'edit',
                          data: {
                            name: currentCategory.name,
                            description: currentCategory.description,
                          },
                        })
                      }
                      className="shrink-0 hover:bg-accent transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Search and Add */}
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Search FAQs in this category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-11 bg-background border-border focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <Button
                    onClick={() => setFaqModal({ isOpen: true, mode: 'create' })}
                    className="bg-linear-to-r from-[#F66435] to-[#672611] rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 whitespace-nowrap h-11"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add FAQ
                  </Button>
                </div>

                {/* FAQs List */}
                {displayFaqs.length === 0 ? (
                  <div className="bg-card border border-border rounded-sm p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-base">
                        {searchTerm
                          ? 'No FAQs found matching your search.'
                          : 'No FAQs in this category yet. Click "Add FAQ" to create one.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 bg-card rounded-sm p-4 border border-border">
                    {displayFaqs.map((faq, index) => (
                      <FaqCard
                        key={faq._id}
                        faq={faq}
                        index={index}
                        onEdit={() =>
                          setFaqModal({
                            isOpen: true,
                            mode: 'edit',
                            data: {
                              question: faq.question,
                              answer: faq.answer,
                            },
                            faqId: faq._id,
                          })
                        }
                        onDelete={() => deleteFaq(faq._id)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-card border border-border rounded-sm p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-sm bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <FolderPlus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-base">
                    Select a category to start managing FAQs
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal({ isOpen: false, mode: 'create' })}
        onSubmit={handleCategorySubmit}
        mode={categoryModal.mode}
        defaultValues={categoryModal.data}
      />

      <FaqModal
        isOpen={faqModal.isOpen}
        onClose={() => setFaqModal({ isOpen: false, mode: 'create' })}
        onSubmit={handleFaqSubmit}
        mode={faqModal.mode}
        defaultValues={faqModal.data}
      />
    </div>
  );
}