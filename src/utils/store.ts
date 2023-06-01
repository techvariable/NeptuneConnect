import path from 'path'
import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import AWS from 'aws-sdk'

export async function storeFileToLocalFilesystem (content: string): Promise<string> {
  const logFolder = process.env.LOCAL_LOG_FOLDER ?? '/logs'
  const logFileName = `${uuidv4()}.json`

  await fs.mkdir(path.join(process.cwd(), logFolder), { recursive: true })
  await fs.writeFile(path.join(process.cwd(), logFolder, logFileName), content)

  return logFileName
}

export async function storeFileToS3 (content: string): Promise<string> {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  const logFileName = `${uuidv4()}.json`
  const bucketFileName: string = process.env.S3_BUCKET_NAME ?? 'neptune-logs'

  const params = {
    Bucket: bucketFileName,
    Key: logFileName,
    Body: content
  }

  await s3.upload(params).promise()

  return logFileName
}

export async function getFileFromS3 (fileName: string): Promise<string> {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  const bucketFileName: string = process.env.S3_BUCKET_NAME ?? 'neptune-logs'
  const data = await s3.getObject({ Bucket: bucketFileName, Key: fileName }).promise()

  return data.Body?.toString() ?? '<EMPTY_LOG>'
}

export async function getFileFromLocal (fileName: string): Promise<string> {
  const logFolder = process.env.LOCAL_LOG_FOLDER ?? '/logs'
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function readFile () {
    try {
      return await fs.readFile(path.join(process.cwd(), logFolder, fileName), { encoding: 'utf8' })
    } catch (err) {
      console.log(err)
    }
  }
  const data = await readFile()
  return data ?? '<EMPTY_LOG>'
}
