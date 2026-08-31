import { useRef, useState, type DragEvent } from "react";
import { maxStlFileSize, validateStlFile } from "../utils/analyzeStl";
import { formatFileSize } from "../utils/format";

interface FileUploaderProps {
  isLoading: boolean;
  fileName?: string;
  fileSize?: number;
  error?: string | null;
  onFileSelected: (file: File) => void;
}

export function FileUploader({
  isLoading,
  fileName,
  fileSize,
  error,
  onFileSelected,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) {
      return;
    }

    const validationError = validateStlFile(file);
    if (validationError) {
      onFileSelected(file);
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  };

  return (
    <section
      className={`upload-zone ${isDragging ? "is-dragging" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".stl,model/stl,application/sla"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <div>
        <p className="eyebrow">Upload your STL file</p>
        <h2>{isLoading ? "Analyzing model..." : fileName ?? "Drop STL here"}</h2>
        <p>
          {fileName && fileSize
            ? `${formatFileSize(fileSize)} loaded`
            : `Binary and ASCII STL up to ${formatFileSize(maxStlFileSize)}`}
        </p>
      </div>
      <button type="button" onClick={() => inputRef.current?.click()}>
        Choose file
      </button>
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}
