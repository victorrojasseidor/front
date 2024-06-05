import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const FileUploadForm = () => {
  // State to manage selected files and drag state
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  // Validation schema for the form using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    files: Yup.mixed().required("At least one file is required"),
  });

  // Handle file input change
  const handleFileChange = (event, setFieldValue) => {
    const newFiles = Array.from(event.currentTarget.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setFieldValue("files", [...files, ...newFiles]);
  };

  // Handle drop event for drag and drop functionality
  const handleDrop = (event, setFieldValue) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    setFieldValue("files", [...files, ...droppedFiles]);
  };

  // Handle drag over event
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  // Handle drag leave event
  const handleDragLeave = () => {
    setDragging(false);
  };

  // Handle file removal
  const handleFileRemove = (fileToRemove, setFieldValue) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    setFiles(updatedFiles);
    setFieldValue("files", updatedFiles);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    for (let i = 0; i < values.files.length; i++) {
      formData.append("files", values.files[i]);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Files uploaded successfully", data);
      resetForm();
      setFiles([]);
    } catch (error) {
      console.error("There was a problem with the file upload", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="containerUpload">
      <Formik initialValues={{ name: "", files: [] }} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, isSubmitting, isValid }) => (
          <Form className="form-container">
            <h1>Formulario de subida de archivos</h1>

            <div className="input-box">
              <Field type="text" id="name" name="name" placeholder="" />
              <label htmlFor="name">Name</label>
              <ErrorMessage className="errorMessage" name="name" component="span" />
            </div>

            <div className={`dropzone ${dragging ? "dragging" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={(event) => handleDrop(event, setFieldValue)}>
              <label htmlFor="files">Arrastra y suelta archivos aquí o haz click para seleccionar</label>
              <input id="files" name="files" type="file" multiple onChange={(event) => handleFileChange(event, setFieldValue)} />
              <ErrorMessage name="files" component="div" />
            </div>

            {files.length > 0 && (
              <div className="filePreview">
                <h4>Archivos seleccionados:</h4>
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>
                      {file.type.startsWith("image/") && <img src={URL.createObjectURL(file)} alt={file.name} className="previewImage" />}
                      {file.name}
                      <button type="button" onClick={() => handleFileRemove(file, setFieldValue)}>
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <button className={isValid ? "btn_primary" : "btn_primary disabled"} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Subiendo..." : "Enviar"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default FileUploadForm;
