import axios from 'axios';

const OCR_URL =
  'https://f5ytt7f6e2.apigw.ntruss.com/custom/v1/27307/98fc5e10db4340ecf1f0b8d4793b12f9160441e0509a1046494ba1a5c376f55e/general'; // APIGW Invoke URL

// image : Base64 encoded image
export const OCRhandler = async (image: string, format: string) => {
  const res = await axios.post(
    OCR_URL,
    {
      images: [{ format, name: 'OCR_Result', data: image.split(',')[1] }],
      // data : only need part of data
      requestId: 'wooung', // unique string
      timestamp: 0,
      version: 'V2',
    },
    { headers: { 'X-OCR-SECRET': process.env.OCR_SECRET_KEY } }
  );
  console.log('requestWithBase64 response:', res.data.images);

  return res.data.images[0].fields.map((field: any) => field.inferText);
};

export async function getPrePost(image: string, format: string, bank: string) {
  const OCRResult = await OCRhandler(image, format);
  console.log('[OCRResult]', OCRResult);

  const result = [];
  let currentTransaction = [];
  let startFlag = false;

  switch (bank) {
    case 'kakaobank':
      OCRResult.forEach((item: string) => {
        if (/^\d+\.\d+$/.test(item)) {
          // 숫자.숫자 형식의 날짜 필터링
          if (startFlag) result.push(currentTransaction);
          currentTransaction = [item, ''];
          startFlag = true;
        }
        // 첫 정규식 만족 시부터 시작, 날짜 ~ x원 데이터만 정제
        else if (startFlag) {
          if (item.includes('원')) {
            // '원'이 포함된 경우 데이터 저장 후 초기화
            currentTransaction.push(item);
            result.push(currentTransaction);
            currentTransaction = [];
            startFlag = false;
          } else {
            // '원'이 포함되지 않은 경우 데이터 이어붙이기
            currentTransaction[currentTransaction.length - 1] += ` ${item}`;
          }
        }
      });
      return result;
    /*
    [ '12.26', '굿모닝 챌린지 알림', '1원' ],
    [ '12.25', '두껍삼 가산디지털단', '-69,000원' ],
    [ '12.25', '메가엠지씨커피 가산', '-7,400원' ],
    */
    case 'tossbank':
      return;
  }
}
