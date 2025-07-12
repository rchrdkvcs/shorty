import QRCode from 'qrcode'

export const useQRCode = () => {
  const generateQRCode = async (text: string): Promise<string> => {
    try {
      return await QRCode.toDataURL(text, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error)
      throw error
    }
  }

  const downloadQRCode = async (text: string, filename: string = 'qrcode.png') => {
    try {
      const dataUrl = await generateQRCode(text)
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Erreur lors du téléchargement du QR code:', error)
    }
  }

  return {
    generateQRCode,
    downloadQRCode,
  }
}
