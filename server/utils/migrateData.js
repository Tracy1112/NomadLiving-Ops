/**
 * Data Migration Script
 *
 * Migrates existing job data from old status/type values to new values:
 *
 * Status Migration:
 * - pending → open
 * - interview → in-progress
 * - declined → cancelled
 *
 * Type Migration:
 * - full-time → high-priority
 * - part-time → routine
 * - remote → maintenance
 * - internship → emergency
 *
 * Usage: node server/utils/migrateData.js
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from server directory (one level up from server/utils)
dotenv.config({ path: join(__dirname, '../.env') })

import Job from '../models/JobModel.js'

// Status mapping: old → new
const statusMapping = {
  pending: 'open',
  interview: 'in-progress',
  declined: 'cancelled',
}

// Type mapping: old → new
const typeMapping = {
  'full-time': 'high-priority',
  'part-time': 'routine',
  remote: 'maintenance',
  internship: 'emergency',
}

const migrateData = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connected to MongoDB')

    // Migrate jobStatus
    console.log('\n=== Migrating Job Status ===')
    for (const [oldStatus, newStatus] of Object.entries(statusMapping)) {
      const result = await Job.updateMany(
        { jobStatus: oldStatus },
        { $set: { jobStatus: newStatus } }
      )
      if (result.modifiedCount > 0) {
        console.log(
          `  ✓ Updated ${result.modifiedCount} jobs: ${oldStatus} → ${newStatus}`
        )
      }
    }

    // Migrate jobType
    console.log('\n=== Migrating Job Type ===')
    for (const [oldType, newType] of Object.entries(typeMapping)) {
      const result = await Job.updateMany(
        { jobType: oldType },
        { $set: { jobType: newType } }
      )
      if (result.modifiedCount > 0) {
        console.log(
          `  ✓ Updated ${result.modifiedCount} jobs: ${oldType} → ${newType}`
        )
      }
    }

    // Verify migration
    console.log('\n=== Verification ===')
    const totalJobs = await Job.countDocuments({})
    const jobsWithNewStatus = await Job.countDocuments({
      jobStatus: { $in: Object.values(statusMapping) },
    })
    const jobsWithNewType = await Job.countDocuments({
      jobType: { $in: Object.values(typeMapping) },
    })

    console.log(`  Total jobs: ${totalJobs}`)
    console.log(`  Jobs with new status values: ${jobsWithNewStatus}`)
    console.log(`  Jobs with new type values: ${jobsWithNewType}`)

    // Check for any remaining old values
    const oldStatusCount = await Job.countDocuments({
      jobStatus: { $in: Object.keys(statusMapping) },
    })
    const oldTypeCount = await Job.countDocuments({
      jobType: { $in: Object.keys(typeMapping) },
    })

    if (oldStatusCount > 0) {
      console.log(
        `  ⚠ Warning: ${oldStatusCount} jobs still have old status values`
      )
    }
    if (oldTypeCount > 0) {
      console.log(
        `  ⚠ Warning: ${oldTypeCount} jobs still have old type values`
      )
    }

    if (oldStatusCount === 0 && oldTypeCount === 0) {
      console.log('\n✅ Migration completed successfully!')
    } else {
      console.log('\n⚠ Migration completed with warnings. Please review.')
    }

    await mongoose.connection.close()
    console.log('\nDatabase connection closed.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    await mongoose.connection.close()
    process.exit(1)
  }
}

// Run migration
migrateData()
