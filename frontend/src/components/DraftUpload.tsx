import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm, useFieldArray } from 'react-hook-form';
import { Upload, File, X, Plus, Loader2 } from 'lucide-react';
import { draftApi } from '../utils/api';
import { DraftFormData } from '../types';
import { cn } from '../utils/cn';

interface DraftUploadProps {
  onSuccess?: (draftId: number) => void;
}

const DraftUpload: React.FC<DraftUploadProps> = ({ onSuccess }) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'manual'>('file');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<DraftFormData>({
    defaultValues: {
      title: '',
      team_names: [''],
      additional_info: '',
      manual_data: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'team_names',
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const onSubmit = async (data: DraftFormData) => {
    setIsSubmitting(true);
    try {
      const submitData: DraftFormData = {
        ...data,
        team_names: data.team_names.filter(name => name.trim() !== ''),
      };

      if (uploadMethod === 'file' && uploadedFile) {
        submitData.file = uploadedFile;
      }

      const draft = await draftApi.createDraft(submitData);
      
      // Reset form
      reset();
      setUploadedFile(null);
      
      if (onSuccess) {
        onSuccess(draft.id);
      }
    } catch (error) {
      console.error('Failed to upload draft:', error);
      // Handle error (show toast notification, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Draft Recap</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Draft Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Draft Title *
          </label>
          <input
            type="text"
            id="title"
            {...register('title', { required: 'Draft title is required' })}
            className={cn(
              'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500',
              errors.title ? 'border-red-300' : 'border-gray-300'
            )}
            placeholder="e.g., 2024 League Championship Draft"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Upload Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Method
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={cn(
                'px-4 py-2 rounded-md border transition-colors',
                uploadMethod === 'file'
                  ? 'bg-primary-100 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('manual')}
              className={cn(
                'px-4 py-2 rounded-md border transition-colors',
                uploadMethod === 'manual'
                  ? 'bg-primary-100 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
            >
              Manual Entry
            </button>
          </div>
        </div>

        {/* File Upload */}
        {uploadMethod === 'file' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Draft File (CSV or TXT)
            </label>
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                isDragActive
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <input {...getInputProps()} />
              {uploadedFile ? (
                <div className="flex items-center justify-center space-x-2">
                  <File className="h-6 w-6 text-green-600" />
                  <span className="text-sm text-gray-900">{uploadedFile.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Drag and drop your draft file here, or click to select
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports CSV and TXT files up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manual Entry */}
        {uploadMethod === 'manual' && (
          <div>
            <label htmlFor="manual_data" className="block text-sm font-medium text-gray-700 mb-1">
              Draft Data *
            </label>
            <textarea
              id="manual_data"
              {...register('manual_data', { 
                required: uploadMethod === 'manual' ? 'Draft data is required' : false 
              })}
              rows={8}
              className={cn(
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500',
                errors.manual_data ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="Paste your draft results here..."
            />
            {errors.manual_data && (
              <p className="mt-1 text-sm text-red-600">{errors.manual_data.message}</p>
            )}
          </div>
        )}

        {/* Team Names */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Owner Names (Optional)
          </label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  {...register(`team_names.${index}` as const)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder={`Team ${index + 1} owner name`}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => append('')}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-800"
            >
              <Plus className="h-4 w-4" />
              <span>Add Team</span>
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Context (Optional)
          </label>
          <textarea
            id="additional_info"
            {...register('additional_info')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="League settings, scoring format, draft strategy, etc."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || (uploadMethod === 'file' && !uploadedFile)}
            className={cn(
              'px-6 py-2 rounded-md font-medium transition-colors flex items-center space-x-2',
              isSubmitting || (uploadMethod === 'file' && !uploadedFile)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            )}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isSubmitting ? 'Uploading...' : 'Upload Draft'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DraftUpload;