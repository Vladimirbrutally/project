import { useEffect, useMemo, useState } from "react";
import { Footer } from "./components/Footer";
import { FileUploader } from "./components/FileUploader";
import { InfillSelector } from "./components/InfillSelector";
import { LayerHeightSelector } from "./components/LayerHeightSelector";
import { MaterialSelector } from "./components/MaterialSelector";
import { ModelInformation } from "./components/ModelInformation";
import { ModelViewer } from "./components/ModelViewer";
import { Navbar } from "./components/Navbar";
import { PriceSummary } from "./components/PriceSummary";
import { QuoteForm } from "./components/QuoteForm";
import { QuantitySelector } from "./components/QuantitySelector";
import { Toast } from "./components/Toast";
import { materials } from "./config/materials";
import {
  infillOptions,
  layerHeightFactors,
  layerHeightOptions,
  pricingConfig,
} from "./config/pricing";
import { printer } from "./config/printer";
import { QuoteSuccess } from "./pages/QuoteSuccess";
import type { ModelAnalysis } from "./types/model";
import type { CustomerDetails } from "./types/order";
import { parseStlFile } from "./utils/analyzeStl";
import { calculatePrice } from "./utils/calculatePrice";
import { calculatePrintTime } from "./utils/calculatePrintTime";
import { calculateWeight } from "./utils/calculateWeight";
import { generateOrderNumber } from "./utils/orderNumber";
import { submitQuote } from "./services/orders";
import { isSupabaseConfigured } from "./services/supabase";

export function App() {
  const [model, setModel] = useState<ModelAnalysis | undefined>();
  const [stlFile, setStlFile] = useState<File | undefined>();
  const [selectedMaterialId, setSelectedMaterialId] = useState("pla");
  const [infill, setInfill] = useState(20);
  const [layerHeight, setLayerHeight] = useState(0.2);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [cameraKey, setCameraKey] = useState(0);
  const [route, setRoute] = useState(window.location.hash || "#/");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState(
    window.sessionStorage.getItem("lastOrderNumber") ?? "",
  );
  const supabaseConfigured = isSupabaseConfigured();

  const selectedMaterial = useMemo(
    () => materials.find((material) => material.id === selectedMaterialId) ?? materials[0],
    [selectedMaterialId],
  );

  const estimatedWeight = useMemo(() => {
    if (!model) {
      return 0;
    }

    return calculateWeight({
      volumeCm3: model.volumeCm3,
      density: selectedMaterial.density,
      infillPercent: infill,
      shellRatio: pricingConfig.shellRatio,
      internalRatio: pricingConfig.internalRatio,
    });
  }, [infill, model, selectedMaterial.density]);

  const printTimeHours = useMemo(() => {
    return calculatePrintTime({
      estimatedWeight,
      layerHeight,
      gramsPerHour: pricingConfig.gramsPerHour,
      layerHeightFactors,
    });
  }, [estimatedWeight, layerHeight]);

  const priceBreakdown = useMemo(() => {
    return calculatePrice({
      estimatedWeight,
      pricePerGram: selectedMaterial.pricePerGram,
      printTimeHours,
      machineRatePerHour: pricingConfig.machineRatePerHour,
      setupCost: pricingConfig.setupCost,
      electricityRatePerHour: pricingConfig.electricityRatePerHour,
      postProcessing: pricingConfig.postProcessing,
      marginPercent: pricingConfig.marginPercent,
      quantity,
      minimumPrice: pricingConfig.minimumPrice,
    });
  }, [estimatedWeight, printTimeHours, quantity, selectedMaterial.pricePerGram]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleFileSelected = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const analysis = await parseStlFile(file, printer);
      setModel(analysis);
      setStlFile(file);
      setCameraKey((value) => value + 1);
      showToast("STL loaded successfully");
    } catch (unknownError) {
      const message =
        unknownError instanceof Error
          ? unknownError.message
          : "Unable to read this STL file. Please verify that the file is valid.";
      setModel(undefined);
      setStlFile(undefined);
      setError(message);
      showToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSuccess = (orderNumber: string) => {
    window.sessionStorage.setItem("lastOrderNumber", orderNumber);
    setSubmittedOrderNumber(orderNumber);
    window.location.hash = "#/quote-success";
    setRoute("#/quote-success");
  };

  const goToCalculator = () => {
    window.location.hash = "#/";
    setRoute("#/");
  };

  const handleQuoteSubmit = async (customer: CustomerDetails) => {
    if (!model || !stlFile) {
      showToast("Please upload an STL file first");
      return;
    }

    if (!customer.privacyAccepted) {
      showToast("Please accept the upload agreement");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();
      const result = await submitQuote({
        orderNumber,
        customer,
        file: stlFile,
        model: {
          fileName: model.fileName,
          fileSize: model.fileSize,
          dimensions: model.dimensions,
          volumeCm3: model.volumeCm3,
          triangleCount: model.triangleCount,
          tooLarge: model.tooLarge,
        },
        printSettings: {
          material: selectedMaterial,
          infillPercent: infill,
          layerHeight,
          quantity,
        },
        estimate: {
          estimatedWeight,
          printTimeHours,
          estimatedPrice: priceBreakdown.totalPrice,
          priceBreakdown,
        },
      });
      showToast("Quote submitted successfully");
      goToSuccess(result.orderNumber);
    } catch (unknownError) {
      const message = unknownError instanceof Error ? unknownError.message : "Unable to submit quote";
      showToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (route === "#/quote-success") {
    return (
      <div id="top" className="app-shell">
        <Navbar />
        <QuoteSuccess orderNumber={submittedOrderNumber || "-"} onBack={goToCalculator} />
        <Footer />
        <Toast message={toast} />
      </div>
    );
  }

  return (
    <div id="top" className="app-shell">
      <Navbar />
      <main id="calculator" className="main-layout">
        <section className="intro">
          <p className="eyebrow">Instant 3D Printing Estimate</p>
          <h1>Get an Instant 3D Printing Estimate</h1>
          <p>
            Upload your STL file, inspect the model, choose print settings, and get a
            browser-side price estimate before any future order submission.
          </p>
        </section>

        <section className="workbench">
          <div className="left-column">
            <FileUploader
              isLoading={isLoading}
              fileName={model?.fileName}
              fileSize={model?.fileSize}
              error={error}
              onFileSelected={handleFileSelected}
            />
            <ModelViewer
              geometry={model?.geometry}
              cameraKey={cameraKey}
              onResetCamera={() => setCameraKey((value) => value + 1)}
            />
          </div>

          <aside className="settings-panel" aria-label="Print settings">
            <MaterialSelector
              materials={materials}
              selectedMaterialId={selectedMaterialId}
              onChange={setSelectedMaterialId}
            />
            <LayerHeightSelector
              options={layerHeightOptions}
              value={layerHeight}
              onChange={setLayerHeight}
            />
            <InfillSelector options={infillOptions} value={infill} onChange={setInfill} />
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <div className="printer-note">
              <span>{printer.name}</span>
              <strong>
                {printer.x} x {printer.y} x {printer.z} mm
              </strong>
            </div>
            {model?.tooLarge ? (
              <p className="warning-text">Model may be too large for the selected printer.</p>
            ) : null}
          </aside>
        </section>

        <section className="result-panel">
          <ModelInformation
            model={model}
            estimatedWeight={estimatedWeight}
            printTimeHours={printTimeHours}
          />
          <PriceSummary
            breakdown={priceBreakdown}
            hasModel={Boolean(model)}
            onRequestQuote={() => document.querySelector(".quote-form")?.scrollIntoView({ behavior: "smooth" })}
          />
        </section>

        <QuoteForm
          disabled={!model}
          isConfigured={supabaseConfigured}
          isSubmitting={isSubmitting}
          onSubmit={handleQuoteSubmit}
        />

        <section id="admin-note" className="phase-note">
          <strong>Phase 2</strong>
          <span>Quote submission is ready for Supabase. Admin routes are still planned for Phase 3.</span>
        </section>
      </main>
      <Footer />
      <Toast message={toast} />
    </div>
  );
}
