import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Building2, Globe, Calendar, MapPin } from "lucide-react";
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
  } = useFormContext<FirmFormData>();
  const [languageInput, setLanguageInput] = useState("");
  const [brokerInput, setBrokerInput] = useState("");
  const [liquidityInput, setLiquidityInput] = useState("");

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

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {}}
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


//  <div className="space-y-2">
//           <Label htmlFor="image" className="text-sm font-medium">
//             Firm Logo
//           </Label>
//           <div className="flex items-center gap-4">
//             {/* Preview */}
//             {watch("firmDetails.image") instanceof File ? (
//               <img
//                 src={URL.createObjectURL(watch("firmDetails.image"))}
//                 alt="Firm Logo Preview"
//                 className="w-16 h-16 rounded-md object-cover border"
//               />
//             ) : watch("firmDetails.image") ? (
//               <img
//                 src={watch("firmDetails.image")}
//                 alt="Existing Logo"
//                 className="w-16 h-16 rounded-md object-cover border"
//               />
//             ) : (
//               <div className="w-16 h-16 rounded-md border flex items-center justify-center text-xs text-muted-foreground">
//                 No Logo
//               </div>
//             )}

//             {/* Upload Button */}
//             <Input
//               id="logoFile"
//               type="file"
//               accept="image/*"
//               className="max-w-xs"
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file)
//                   setValue("firmDetails.image", file, {
//                     shouldValidate: true,
//                   });
//               }}
//             />
//           </div>
//         </div>