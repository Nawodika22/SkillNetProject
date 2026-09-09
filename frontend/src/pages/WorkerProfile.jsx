import React, { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react'
import { workerService } from '../services/authService'

export default function WorkerProfile({ userId }) {
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
      const response = await workerService.getProfile(userId)
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
      const response = await workerService.updateProfile(userId, formData)
      if (response.success) {
        setProfile(response.data)
        setEditMode(false)
        setError('')
      }
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  const toggleAvailability = async () => {
    try {
      const newAvailability = !profile.isAvailable
      const response = await workerService.updateAvailability(userId, newAvailability)
      if (response.success) {
        setProfile(prev => ({
          ...prev,
          isAvailable: newAvailability
        }))
      }
    } catch (err) {
      setError('Failed to update availability')
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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h1>
              <p className="text-blue-100 mt-1">{profile.profession}</p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
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
          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Availability Status</p>
              <p className="text-sm text-gray-600">
                {profile.isAvailable ? '✓ You are available for work' : '✗ You are not available'}
              </p>
            </div>
            <button
              onClick={toggleAvailability}
              className={`p-2 rounded-lg transition ${
                profile.isAvailable
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {profile.isAvailable ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={18} />
                Verified Email
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="verifiedEmail"
                  value={formData.verifiedEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.verifiedEmail}</p>
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

          {/* Professional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Briefcase size={18} />
                Profession
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.profession}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={18} />
                Years of Experience
              </label>
              {editMode ? (
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.yearsOfExperience} years</p>
              )}
            </div>
          </div>

          {/* Location */}
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

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
            {editMode ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-900">{profile.bio || 'No bio provided'}</p>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
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
