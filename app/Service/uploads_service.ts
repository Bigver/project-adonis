import Application from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon'
import fs from 'fs'


export default class uploadService {
    public static async upload(File: any) {
        if (!File) {
            return
          }
          const fileName = `${DateTime.local().toFormat('yyyyMMddHHmmss')}-${File?.clientName}`
          // บันทึกไฟล์ลง disk ที่กำหนด
          await File.move(Application.publicPath("uploads"), {
            name: fileName,
            overwrite: true,
          });
          if (File.state === "moved") {
            // บันทึกไฟล์ลง disk สำเร็จ
            return fileName;
          } else {
            // บันทึกไฟล์ไม่สำเร็จ
            return console.log("Failed to upload file");
          }
    }

    public static async deleteFile(File: any) {
      fs.unlink(`public${File}`, (err) => {
        if (err) {
          return
        }
      })
    }
     
}