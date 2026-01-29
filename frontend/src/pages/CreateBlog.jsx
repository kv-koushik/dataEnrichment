import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiCheck, FiInfo, FiAward, FiImage } from 'react-icons/fi';
import { blogAPI } from '../utils/api';
import Header from '../components/Header';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    tittle: '',
    travelexp: '',
    imgs: [''],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageChange = (index, value) => {
    const newImgs = [...formData.imgs];
    newImgs[index] = value;
    setFormData(prev => ({ ...prev, imgs: newImgs }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, imgs: [...prev.imgs, ''] }));
  };

  const removeImageField = (index) => {
    const newImgs = formData.imgs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, imgs: newImgs.length > 0 ? newImgs : [''] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tittle.trim()) newErrors.tittle = 'Title is required';
    if (!formData.travelexp.trim()) newErrors.travelexp = 'Travel experience is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty image URLs
      const filteredImgs = formData.imgs.filter(img => img.trim() !== '');
      
      await blogAPI.createBlog({
        tittle: formData.tittle,
        travelexp: formData.travelexp,
        imgs: filteredImgs,
      });

      setSubmitSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/my-blogs');
      }, 2000);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to create blog. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="flex items-center justify-center p-4 py-20 animate-fade-in">
          <div className="section-card max-w-md w-full text-center animate-slide-up">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse-slow"></div>
              <div className="absolute inset-2 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <FiCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
              Blog Created!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Your travel experience has been shared successfully. Redirecting to your blogs...
            </p>
            <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 font-semibold">
              <FiAward className="w-5 h-5" />
              <span>Keep sharing amazing experiences!</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 dark:from-primary-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Share Your Travel Experience
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Tell the world about your amazing journey
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="section-card space-y-8 animate-slide-up">
          {/* Title */}
          <section>
            <h2 className="section-header">
              <span className="text-2xl">📋</span>
              Blog Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tittle}
                  onChange={(e) => handleInputChange('tittle', e.target.value)}
                  placeholder="e.g., Amazing 5-day trip to Goa"
                  className={`form-input ${errors.tittle ? 'border-red-500 dark:border-red-500 ring-red-500' : ''}`}
                />
                {errors.tittle && <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                  <FiX className="w-4 h-4" /> {errors.tittle}
                </p>}
              </div>
            </div>
          </section>

          {/* Travel Experience */}
          <section>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Travel Experience <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.travelexp}
                onChange={(e) => handleInputChange('travelexp', e.target.value)}
                placeholder="Share your complete travel experience - hotels, attractions, food, local commute, costs, safety tips, and anything else that would help fellow travelers..."
                rows="12"
                className={`form-textarea ${errors.travelexp ? 'border-red-500 dark:border-red-500 ring-red-500' : ''}`}
              />
              {errors.travelexp && <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                <FiX className="w-4 h-4" /> {errors.travelexp}
              </p>}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <FiInfo className="w-3 h-3" /> The more detailed your experience, the more helpful it is!
              </p>
            </div>
          </section>

          {/* Image URLs */}
          <section>
            <h2 className="section-header">
              <FiImage className="inline" />
              Image URLs (Optional)
            </h2>
            <div className="space-y-3">
              {formData.imgs.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="form-input flex-1"
                  />
                  {formData.imgs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline text-sm"
              >
                + Add another image URL
              </button>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 text-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Blog...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiCheck className="w-5 h-5" /> Create Blog
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/all-blogs')}
              className="btn-secondary text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
