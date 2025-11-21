import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Plus,
  Building2,
  Globe,
  Calendar,
  MapPin,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FirmFormData } from "../schema/schema";

interface Step1FirmDetailsProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onSubmit: () => void;
}

export default function Step1FirmDetails({
  onNext,
  isFirstStep,
}: Step1FirmDetailsProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useFormContext<FirmFormData>();
  const [languageInput, setLanguageInput] = useState("");
  const [brokerInput, setBrokerInput] = useState("");
  const [liquidityInput, setLiquidityInput] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const existingImage = watch("firmDetails.image"); // {url, publicId, thumbnail} | undefined
  // const imageFile = watch("firmDetails.imageFile"); // File | undefined

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be ≤ 5 MB");
        return;
      }

      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
      setValue("firmDetails.imageFile", file, { shouldValidate: true });
      clearErrors("firmDetails.imageFile");
    },
    [setValue, clearErrors]
  );

  // Remove new file
  const handleRemoveNew = () => {
    setNewImageFile(null);
    setNewImagePreview(null);
    setValue("firmDetails.imageFile", undefined);
  };

  // Remove existing image (will be deleted on save)
  const handleRemoveExisting = () => {
    setValue("firmDetails.image", undefined);
    setValue("firmDetails.imageFile", undefined); // ensure no file
    setNewImageFile(null);
    setNewImagePreview(null);
  };
  const languages = watch("firmDetails.languagesSupported") || [];
  const brokers = watch("firmDetails.brokers") || [];
  const liquidityProviders = watch("firmDetails.liquidityProviders") || [];

  const addLanguage = () => {
    if (languageInput.trim() && !languages.includes(languageInput.trim())) {
      setValue(
        "firmDetails.languagesSupported",
        [...languages, languageInput.trim()],
        { shouldValidate: true }
      );
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    setValue(
      "firmDetails.languagesSupported",
      languages.filter((l: string) => l !== lang),
      { shouldValidate: true }
    );
  };

  const addBroker = () => {
    if (brokerInput.trim() && !brokers.includes(brokerInput.trim())) {
      setValue("firmDetails.brokers", [...brokers, brokerInput.trim()], {
        shouldValidate: true,
      });
      setBrokerInput("");
    }
  };

  const removeBroker = (broker: string) => {
    setValue(
      "firmDetails.brokers",
      brokers.filter((b: string) => b !== broker),
      { shouldValidate: true }
    );
  };

  const addLiquidityProvider = () => {
    if (
      liquidityInput.trim() &&
      !liquidityProviders.includes(liquidityInput.trim())
    ) {
      setValue(
        "firmDetails.liquidityProviders",
        [...liquidityProviders, liquidityInput.trim()],
        { shouldValidate: true }
      );
      setLiquidityInput("");
    }
  };

  const removeLiquidityProvider = (provider: string) => {
    setValue(
      "firmDetails.liquidityProviders",
      liquidityProviders.filter((p: string) => p !== provider),
      { shouldValidate: true }
    );
  };

  const statusOptions = ["Active", "Inactive", "Under Review", "Suspended"];
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i
  );

  // === DETERMINE WHAT TO SHOW ===
  const showExisting = existingImage && !newImageFile;
  // console.log("🚀 ~ Step1FirmDetails ~ showExisting:", showExisting)
  const showNew = newImageFile;
  // const showPlaceholder = !existingImage && !newImageFile;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary-foreground" />
          Firm Details
        </h2>
        <p className="text-gray-600 mt-1">
          Enter the basic information about the funding firm
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Firm Logo Upload */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Firm Logo</Label>
          <div className="flex items-start gap-6">
            {/* PREVIEW */}
            <div className="relative">
              {showExisting && existingImage ? (
                <div className="relative group">
                  <img
                    src={existingImage.thumbnail || existingImage.url}
                    alt="Current logo"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-border shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      Current
                    </span>
                  </div>
                </div>
              ) : showNew && newImagePreview ? (
                <div className="relative group">
                  <img
                    src={newImagePreview}
                    alt="New logo preview"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-primary shadow-sm"
                  />
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                    New
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                  <svg
                    className="w-8 h-8 mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs font-medium">No Logo</span>
                </div>
              )}
            </div>

            {/* UPLOAD INPUT & ACTIONS */}
            <div className="flex-1 space-y-3">
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  PNG, JPG, or WebP (max 5 MB)
                </p>
              </div>

              {/* REMOVE BUTTONS */}
              <div className="flex gap-2">
                {showExisting && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveExisting}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove Logo
                  </Button>
                )}
                {showNew && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveNew}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Cancel Upload
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {errors.firmDetails?.imageFile && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20">
              <svg
                className="w-4 h-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-medium">
                {errors.firmDetails.imageFile.message}
              </p>
            </div>
          )}
        </div>

        {/* Firm Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Firm Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("firmDetails.name")}
            placeholder="e.g., FTMO"
            className={errors.firmDetails?.name ? "border-red-500" : ""}
          />
          {errors.firmDetails?.name && (
            <p className="text-sm text-red-500">
              {errors.firmDetails.name.message as string}
            </p>
          )}
        </div>

        {/* Legal Entity Name */}
        <div className="space-y-2">
          <Label htmlFor="legalEntityName" className="text-sm font-medium">
            Legal Entity Name
          </Label>
          <Input
            id="legalEntityName"
            {...register("firmDetails.legalEntityName")}
            placeholder="Official registered name"
          />
        </div>

        {/* Registration Number */}
        <div className="space-y-2">
          <Label htmlFor="registrationNumber" className="text-sm font-medium">
            Registration Number
          </Label>
          <Input
            id="registrationNumber"
            {...register("firmDetails.registrationNumber")}
            placeholder="Company registration #"
          />
        </div>

        {/* License Number */}
        <div className="space-y-2">
          <Label htmlFor="licenseNumber" className="text-sm font-medium">
            License Number
          </Label>
          <Input
            id="licenseNumber"
            {...register("firmDetails.licenseNumber")}
            placeholder="Regulatory license #"
          />
        </div>

        {/* Regulator */}
        <div className="space-y-2">
          <Label htmlFor="regulator" className="text-sm font-medium">
            Regulator
          </Label>
          <Input
            id="regulator"
            {...register("firmDetails.regulator")}
            placeholder="e.g., FCA, CySEC"
          />
        </div>

        {/* Jurisdiction */}
        <div className="space-y-2">
          <Label htmlFor="jurisdiction" className="text-sm font-medium">
            Jurisdiction
          </Label>
          <Input
            id="jurisdiction"
            {...register("firmDetails.jurisdiction")}
            placeholder="e.g., United Kingdom"
          />
        </div>

        {/* Year Founded */}
        <div className="space-y-2">
          <Label
            htmlFor="yearFounded"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Year Founded <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(value) =>
              setValue("firmDetails.yearFounded", parseInt(value), {
                shouldValidate: true,
              })
            }
            defaultValue={currentYear.toString()}
          >
            <SelectTrigger
              className={
                errors.firmDetails?.yearFounded ? "border-red-500" : ""
              }
            >
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.firmDetails?.yearFounded && (
            <p className="text-sm text-red-500">
              {errors.firmDetails.yearFounded.message as string}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          <Select
            onValueChange={(value) => setValue("firmDetails.status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* HQ Address */}
      <div className="space-y-2">
        <Label
          htmlFor="hqAddress"
          className="text-sm font-medium flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          Headquarters Address
        </Label>
        <Input
          id="hqAddress"
          {...register("firmDetails.hqAddress")}
          placeholder="Full address"
        />
      </div>

      {/* Official Website */}
      <div className="space-y-2">
        <Label
          htmlFor="officialWebsite"
          className="text-sm font-medium flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          Official Website
        </Label>
        <Input
          id="officialWebsite"
          {...register("firmDetails.officialWebsite")}
          placeholder="https://example.com"
          type="url"
          className={
            errors.firmDetails?.officialWebsite ? "border-red-500" : ""
          }
        />
        {errors.firmDetails?.officialWebsite && (
          <p className="text-sm text-red-500">
            {errors.firmDetails.officialWebsite.message as string}
          </p>
        )}
      </div>

      {/* Company Description */}
      <div className="space-y-2">
        <Label htmlFor="companyDescription" className="text-sm font-medium">
          Company Description
        </Label>
        <Textarea
          id="companyDescription"
          {...register("firmDetails.companyDescription")}
          placeholder="Brief description of the firm..."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Languages Supported */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Languages Supported</Label>
        <div className="flex gap-2">
          <Input
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            placeholder="Add a language"
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addLanguage())
            }
          />
          <Button
            type="button"
            onClick={addLanguage}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {languages.map((lang: string) => (
            <Badge key={lang} variant="secondary" className="px-3 py-1">
              {lang}
              <button
                type="button"
                onClick={() => removeLanguage(lang)}
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Brokers */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Brokers</Label>
        <div className="flex gap-2">
          <Input
            value={brokerInput}
            onChange={(e) => setBrokerInput(e.target.value)}
            placeholder="Add a broker"
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addBroker())
            }
          />
          <Button
            type="button"
            onClick={addBroker}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {brokers.map((broker: string) => (
            <Badge key={broker} variant="secondary" className="px-3 py-1">
              {broker}
              <button
                type="button"
                onClick={() => removeBroker(broker)}
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Liquidity Providers */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Liquidity Providers</Label>
        <div className="flex gap-2">
          <Input
            value={liquidityInput}
            onChange={(e) => setLiquidityInput(e.target.value)}
            placeholder="Add a liquidity provider"
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addLiquidityProvider())
            }
          />
          <Button
            type="button"
            onClick={addLiquidityProvider}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {liquidityProviders.map((provider: string) => (
            <Badge key={provider} variant="secondary" className="px-3 py-1">
              {provider}
              <button
                type="button"
                onClick={() => removeLiquidityProvider(provider)}
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-row justify-between gap-2">

        {/* Total Payout */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Total Payout</Label>
          <Input
            type="number"
            {...register("firmDetails.totalPayout")}
            placeholder="Enter total payout"
          />
        </div>
        {/* slug */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Slug</Label>
          <Input
            type="text"
            {...register("firmDetails.slug")}
            placeholder="Enter slug"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => { }}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        <Button type="button" onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
