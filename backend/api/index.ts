export default function handler(req: any, res: any) {
  res.status(200).json({ status: 'OK', message: 'instaCart.PH API is healthy' });
}