'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { TProduct } from '@/types/product.type';
import Image from 'next/image';
import StarRatings from 'react-star-ratings';
import { useEffect, useState } from 'react';
import { TReview } from '@/types/review.type';
import { Progress } from '@/components/ui/progress';

interface ProductModalProps {
  selectedProduct: TProduct | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ProductViewModal = ({
  selectedProduct,
  isOpen,
  onOpenChange,
}: ProductModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // When data is loaded, set the first image as default
  useEffect(() => {
    if (selectedProduct?.images?.length) {
      setSelectedImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const price = Number(selectedProduct?.price || 0);
  const discountStr = selectedProduct?.discountPrice || '0%';

  // Remove the '%' and convert to number
  const discountPercent = Number(discountStr.replace('%', ''));

  // Calculate discounted price
  const discountedPrice = price - (price * discountPercent) / 100;

  const totalReviews = selectedProduct?.reviews?.length ?? 0;

  const progress = [5, 4, 3, 2, 1].map((star) => {
    const count =
      selectedProduct?.reviews?.filter((r: TReview) => r.rating === star)
        .length ?? 0;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  console.log(progress);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full lg:max-w-[90rem] lg:h-[90vh] h-auto mx-auto rounded-lg p-6 overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100"></DialogTitle>
          <DialogDescription asChild>
            <Card className="overflow-hidden border-none p-3 shadow-none">
              <div className="my-20">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Product Image Section */}
                  <div>
                    <div className="rounded-lg flex items-center justify-center h-[400px] relative overflow-hidden">
                      {selectedImage && (
                        <Image
                          src={selectedImage}
                          alt="Product Image"
                          width={400}
                          height={400}
                          className="rounded object-contain transition-transform duration-300 hover:scale-110"
                        />
                      )}
                    </div>
                    {/* Thumbnails */}
                    <div className="gap-3 mt-12 flex justify-start flex-wrap">
                      {selectedProduct?.images?.map((image, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`border-2 rounded-md p-1 transition ${
                            selectedImage === image.url
                              ? 'border-green-800'
                              : 'border-gray-300'
                          }`}
                          onClick={() => setSelectedImage(image.url)}
                        >
                          <Image
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-md cursor-pointer object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mt-5 lg:mt-0">
                    {/* Product first part */}
                    <div className="mb-6">
                      <h2>
                        {selectedProduct?.discountPrice && (
                          <span className="bg-[#FCE9EACC] text-[#5F1011] p-3 rounded font-semibold uppercase">
                            Special Offer
                          </span>
                        )}
                      </h2>

                      <div className="flex items-center gap-2 mt-5">
                        <StarRatings
                          rating={selectedProduct?.avgRating}
                          starRatedColor="#E8B006"
                          name="rating"
                          starSpacing="1px"
                          starDimension="24px"
                        />
                        <p className="text-[#6B7280] text-base">
                          ({selectedProduct?.avgRating?.toFixed(1)} /{' '}
                          {selectedProduct?.reviews?.length} reviews)
                        </p>
                      </div>

                      <h1 className="text-2xl text-[#212529] my-3">
                        {selectedProduct?.name}
                      </h1>

                      <div>
                        {/* Original Price */}
                        <div className="flex items-center">
                          <p
                            className={`text-xl font-medium ${
                              discountPercent > 0
                                ? 'text-gray-500 line-through pr-3'
                                : 'text-gray-800'
                            }`}
                          >
                            ${price.toFixed(2)}
                          </p>
                          {selectedProduct?.discountPrice && (
                            <span className="text-sm font-semibold text-[#E12728] uppercase italic">
                              {selectedProduct?.discountPrice} Off
                            </span>
                          )}
                        </div>

                        {/* Discounted Price */}
                        {discountPercent > 0 && (
                          <p className="text-2xl font-semibold text-gray-800 mt-1">
                            ${discountedPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Product second part  */}
                    <div>
                      <div className="my-2 font-medium flex justify-between items-center p-5 border-t">
                        <span>Product Code</span>
                        <span className="font-medium">
                          {selectedProduct?.productCode}
                        </span>
                      </div>

                      <div className="my-2 font-medium flex justify-between items-center bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-5">
                        <span>Product Type</span>
                        <span className="font-medium">
                          {selectedProduct?.productType}
                        </span>
                      </div>

                      <div className="my-2 font-medium flex justify-between items-center p-5">
                        <span>Size</span>
                        <span className="font-medium">
                          {selectedProduct?.size}
                        </span>
                      </div>

                      <div className="my-2 font-medium flex justify-between items-center bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-5">
                        <span>Product Colors</span>
                        <div className="flex gap-2 flex-wrap">
                          {selectedProduct?.colors?.map(
                            (color: string, index: number) => (
                              <span
                                key={index}
                                className="rounded-full text-sm font-medium border capitalize"
                                style={{
                                  backgroundColor: color,
                                  color: '#fff',
                                }}
                              >
                                {color}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Quantity & Stock */}
                      <div className="my-2 font-medium flex justify-between items-center p-5">
                        <p className="rounded-full px-4 py-1 bg-gray-100 capitalize">
                          Quantity: {selectedProduct?.quantity}
                        </p>
                        <p className="rounded-full px-4 py-1 bg-gray-100 capitalize">
                          Status: {selectedProduct?.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-10">
                  <h5 className="text-lg font-medium uppercase border-b py-1">
                    Description
                  </h5>
                  <p className="mt-2 text-base text-gray-500">
                    {selectedProduct?.description}
                  </p>
                </div>

                {/* Review section */}
                <div className=" my-10 gap-4">
                  {/* Average rating */}
                  <div className="w-full bg-[#f2f9fb] p-6 rounded-lg mb-4 lg:mb-0">
                    <h2 className="text-2xl mb-2">Average Rating</h2>

                    <div className="flex items-center gap-2 mt-5">
                      {selectedProduct ? (
                        <StarRatings
                          rating={Number(selectedProduct.avgRating) || 0} // default to 0 if undefined
                          starRatedColor="#E8B006"
                          name={`rating-${selectedProduct._id}`} // unique name
                          starSpacing="1px"
                          starDimension="24px"
                        />
                      ) : (
                        <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div> // loading skeleton
                      )}

                      <p className="text-[#6B7280] text-base">
                        ({selectedProduct?.avgRating?.toFixed(1) || 0} /{' '}
                        {selectedProduct?.reviews?.length || 0} reviews)
                      </p>
                    </div>

                    <div className="mt-5 space-y-2">
                      {progress?.map(({ star, percentage }) => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="w-4 text-sm font-medium text-gray-700">
                            {star}
                          </span>
                          <Progress
                            value={percentage}
                            className="flex-1 h-1 bg-gray-200 rounded-full"
                          />
                          <span className="w-10 text-sm text-gray-600">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProductViewModal;
