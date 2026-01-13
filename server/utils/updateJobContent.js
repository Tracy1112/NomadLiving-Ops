/**
 * Update Job Content Script
 * 
 * Updates existing job data to match NomadLiving Ops Console context:
 * - Updates company names to property/vendor names
 * - Updates position titles to task/issue descriptions
 * - Updates jobLocation to zone/area names
 * 
 * Usage: node server/utils/updateJobContent.js
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from server directory
dotenv.config({ path: join(__dirname, '../.env') })

import Job from '../models/JobModel.js'

// Property/Vendor name pool
const properties = [
  'Cabin 01', 'Cabin 02', 'Cabin 03', 'Cabin 04', 'Cabin 05',
  'Luxury Tent Alpha', 'Luxury Tent Beta', 'Luxury Tent Gamma',
  'Treehouse A', 'Treehouse B', 'Treehouse C',
  'Airstream 01', 'Airstream 02', 'Airstream 03',
  'Vendor ABC Supplies', 'Vendor XYZ Services', 'Vendor Premium Goods',
  'Glamping Site North', 'Glamping Site South', 'Glamping Site East',
  'Property Unit 1', 'Property Unit 2', 'Property Unit 3'
]

// Task/Issue pool
const tasks = [
  'Fix AC Unit', 'Deep Clean Required', 'HVAC Maintenance',
  'Plumbing Repair', 'Electrical Check', 'WiFi Setup',
  'Supply Order - Linens', 'Supply Order - Toiletries', 'Supply Order - Kitchen',
  'Landscaping', 'Fence Repair', 'Gate Maintenance',
  'Appliance Replacement', 'Window Repair', 'Roof Inspection',
  'Fire Safety Check', 'Security System Update', 'Water Heater Service',
  'Bed Replacement', 'Furniture Assembly', 'Lighting Installation'
]

// Zone/Area pool
const zones = [
  'Zone A - North Camp', 'Zone B - South Camp', 'Zone C - East Camp',
  'Main Site', 'Secondary Site', 'VIP Area',
  'Reception Area', 'Common Area', 'Service Zone',
  'Campground 1', 'Campground 2', 'Campground 3'
]

const updateJobContent = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connected to MongoDB\n')

    // Get all jobs
    const jobs = await Job.find({})
    console.log(`Found ${jobs.length} jobs to update\n`)

    let updated = 0
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i]
      const index = i % properties.length
      
      const updates = {
        company: properties[index],
        position: tasks[i % tasks.length],
        jobLocation: zones[i % zones.length]
      }

      await Job.updateOne(
        { _id: job._id },
        { $set: updates }
      )
      updated++
    }

    console.log(`✅ Successfully updated ${updated} jobs`)
    console.log('   - Company names → Property/Vendor names')
    console.log('   - Position titles → Task/Issue descriptions')
    console.log('   - Job locations → Zone/Area names')

    await mongoose.connection.close()
    console.log('\nDatabase connection closed.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Update failed:', error)
    await mongoose.connection.close()
    process.exit(1)
  }
}

// Run update
updateJobContent()
