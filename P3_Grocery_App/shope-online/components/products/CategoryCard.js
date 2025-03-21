import Link from 'next/link';
import Image from 'next/image';

const CategoryCard = ({ category }) => {
  return (
    <Link href={`/products?category=${category.slug}`} className="relative flex flex-col items-center bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-60 w-full">
      <div className="relative w-full h-40">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-4 w-full text-center">
        <h3 className="font-medium text-lg text-gray-800">{category.name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard; 