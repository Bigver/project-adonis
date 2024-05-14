import _ from 'lodash'

export default class UrlService {

  static async getUrlsForRange(start: number, end: number): Promise<{ url: string; page: number }[]> {
    const urls: { url: string; page: number }[] = []; // ระบุประเภทของอาร์เรย์
    for (let i = start; i <= end; i++) {
      urls.push({ url: `/?page=${i}`, page: i });
    }
    return urls;
  }
  

}