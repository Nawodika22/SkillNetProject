import React, { useState, useEffect } from 'react'
import { Building2, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react'
import { hrService } from '../services/authService'

export default function HRProfile({ userId }) {
  const [profile, setProfile] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await hrService.getProfile(userId)
      if (response.success) {
        setProfile(response.data)
        setFormData(response.data)
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      const response = await hrService.updateProfile(userId, formData)
      if (response.success) {
        setProfile(response.data)
        setEditMode(false)
        setError('')
      }
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>
  }

  if (!profile) {
    return <div className="text-center py-12 text-red-600">Profile not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-t-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Building2 size={32} />
                {profile.companyName}
              </h1>
              <p className="text-purple-100 mt-1">{profile.hrContactName}</p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition"
            >
              {editMode ? (
                <>
                  <X size={18} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 size={18} />
                  Edit
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={18} />
                Company Email
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.companyEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={18} />
                Phone Number
              </label>
              {editMode ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.phoneNumber}</p>
              )}
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Building2 size={18} />
                Company Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={18} />
                Location
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.location}</p>
              )}
            </div>
          </div>

          {/* HR Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">HR Contact Name</label>
            {editMode ? (
              <input
                type="text"
                name="hrContactName"
                value={formData.hrContactName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-900">{profile.hrContactName}</p>
            )}
          </div>

          {/* Company Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
            {editMode ? (
              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-900">{profile.companyDescription || 'No description provided'}</p>
            )}
          </div>

          {/* Profile Metadata */}
          <div className="pt-4 border-t border-gray-200 text-sm text-gray-600">
            <p>Created: {new Date(profile.createdAt).toLocaleDateString()}</p>
            <p>Last updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
          </div>

          {/* Save Button */}
          {editMode && (
            <button
              onClick={handleSave}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
