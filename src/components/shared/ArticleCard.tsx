import { CldImage } from 'next-cloudinary'

interface ArticleCardProps {
  title: string
  imagePublicId: string
}

export function ArticleCard({ title, imagePublicId }: ArticleCardProps) {
  return (
    <div>
      {/* next-cloudinary optimiza automaticamente el formato y tamano */}
      <CldImage
        width={800}
        height={450}
        src={imagePublicId}
        alt={title}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
        // Cloudinary crop inteligente centrado en la cara o sujeto principal
        crop={{ type: 'auto', source: true }}
      />
      <h2>{title}</h2>
    </div>
  )
}