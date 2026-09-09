import React, { useState, useEffect } from 'react'
import { MapPin, Briefcase, Calendar, Mail, Phone, Search, ArrowRight, Loader } from 'lucide-react'
import { workerService } from '../services/authService'

export default function WorkerSearch() {
  const [workers, setWorkers] = useState([])
  const [filteredWorkers, setFilteredWorkers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState('location')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Load all workers on component mount
    loadAllWorkers()
  }, [])

  const loadAllWorkers = async () => {
    try {
      setLoading(true)
      const response = await workerService.getAllWorkers()
      if (response.success) {
        setWorkers(response.data)
        setFilteredWorkers(response.data)
      }
    } catch (err) {
      setError('Failed to load workers')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setFilteredWorkers(workers)
      return
    }

    try {
      setLoading(true)
      setError('')
      let response

      if (searchType === 'location') {
        response = await workerService.getAvailableByLocation(searchQuery)
      } else {
        response = await workerService.getAvailableByProfession(searchQuery)
      }

      if (response.success) {
        setFilteredWorkers(response.data)
      }
    } catch (err) {
      setError(`No workers found for "${searchQuery}"`)
      setFilteredWorkers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Skilled Workers</h1>
          <p className="text-gray-600">Search available workers by location or profession</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search By</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="location"
                      checked={searchType === 'location'}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">Location</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="profession"
                      checked={searchType === 'profession'}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">Profession</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchType === 'location' ? 'Enter city/region...' : 'Enter profession...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {filteredWorkers.length} Worker{filteredWorkers.length !== 1 ? 's' : ''} Found
          </h2>

          {filteredWorkers.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No workers found. Try adjusting your search criteria.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <div key={worker.profileId} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                  <h3 className="text-xl font-bold">{worker.firstName} {worker.lastName}</h3>
                  <p className="text-blue-100">{worker.profession}</p>
                </div>

                {/* Profile Content */}
                <div className="p-4 space-y-3">
                  {/* Experience */}
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar size={18} className="text-blue-600" />
                    <span>{worker.yearsOfExperience} years experience</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin size={18} className="text-blue-600" />
                    <span>{worker.location}</span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail size={18} className="text-blue-600" />
                    <span className="text-sm truncate">{worker.verifiedEmail}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone size={18} className="text-blue-600" />
                    <span>{worker.phoneNumber}</span>
                  </div>

                  {/* Bio */}
                  {worker.bio && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600 line-clamp-2">{worker.bio}</p>
                    </div>
                  )}

                  {/* Availability Status */}
                  <div className="pt-2 border-t border-gray-200">
                    {worker.isAvailable ? (
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        ✓ Available
                      </span>
                    ) : (
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                        ✗ Unavailable
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2">
                    Contact Worker
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
