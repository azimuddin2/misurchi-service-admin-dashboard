'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { TService } from '@/types/service.type';
import Image from 'next/image';
import StarRatings from 'react-star-ratings';
import { useEffect, useState } from 'react';
import { TReview } from '@/types/review.type';
import { Progress } from '@/components/ui/progress';

interface ServiceViewModalProps {
  selectedService: TService | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ServiceViewModal = ({
  selectedService,
  isOpen,
  onOpenChange,
}: ServiceViewModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // When modal opens or service changes, set first image
  useEffect(() => {
    if (selectedService?.images?.length) {
      setSelectedImage(selectedService.images[0].url);
    }
  }, [selectedService]);

  const firstPricing = selectedService?.savedServices?.[0];
  const price = Number(firstPricing?.price || 0);
  const discountStr = firstPricing?.discount || '0%';

  const discountPercent = Number(discountStr.replace('%', ''));
  const discountedPrice = price - (price * discountPercent) / 100;

  const totalReviews = selectedService?.reviews?.length ?? 0;

  const progress = [5, 4, 3, 2, 1].map((star) => {
    const count =
      selectedService?.reviews?.filter((r: TReview) => r.rating === star)
        .length ?? 0;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full lg:max-w-[90rem] lg:h-[90vh] h-auto mx-auto rounded-lg p-6 overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {selectedService?.name}
          </DialogTitle>
          <DialogDescription asChild>
            <Card className="overflow-hidden border-none p-3 shadow-none">
              <div className="my-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Section */}
                  <div>
                    <div className="rounded-lg flex items-center justify-center h-[400px] relative overflow-hidden">
                      {selectedImage && (
                        <Image
                          src={selectedImage}
                          alt="Service Image"
                          width={400}
                          height={400}
                          className="rounded object-contain transition-transform duration-300 hover:scale-110"
                        />
                      )}
                    </div>

                    {/* Thumbnails */}
                    <div className="gap-3 mt-6 flex justify-start flex-wrap">
                      {selectedService?.images?.map((image, index) => (
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

                  {/* Info Section */}
                  <div>
                    {/* Discount Banner */}
                    {firstPricing?.discount &&
                      firstPricing.discount !== 'none' &&
                      firstPricing.discount.trim() !== '' && (
                        <span className="bg-[#FCE9EACC] text-[#5F1011] px-4 py-2 rounded font-semibold uppercase">
                          Special Offer
                        </span>
                      )}

                    {/* Ratings */}
                    <div className="flex items-center gap-2 mt-5">
                      <StarRatings
                        rating={selectedService?.avgRating || 0}
                        starRatedColor="#E8B006"
                        name="rating"
                        starSpacing="1px"
                        starDimension="24px"
                      />
                      <p className="text-[#6B7280] text-base">
                        ({selectedService?.avgRating?.toFixed(1)} /{' '}
                        {selectedService?.reviews?.length} reviews)
                      </p>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl text-[#212529] my-3">
                      {selectedService?.name}
                    </h1>

                    {/* Pricing */}
                    <div>
                      <div className="flex items-center">
                        <p
                          className={`text-xl font-medium ${
                            discountPercent > 0
                              ? 'text-gray-500 line-through'
                              : 'text-gray-800'
                          }`}
                        >
                          ${price.toFixed(2)}
                        </p>
                        {firstPricing?.discount &&
                          firstPricing.discount !== 'none' && (
                            <p className="px-3 py-1 text-sm font-semibold text-[#E12728] uppercase italic">
                              {firstPricing.discount} Off
                            </p>
                          )}
                      </div>
                      {discountPercent > 0 && (
                        <p className="text-2xl font-semibold text-gray-800 mt-1">
                          ${discountedPrice.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Extra Details */}
                    <div className="mt-6">
                      <div className="my-2 font-medium flex justify-between items-center p-4 border-t">
                        <span>Service Id</span>
                        <span>{selectedService?.serviceId}</span>
                      </div>
                      <div className="my-2 font-medium flex justify-between items-center bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-4">
                        <span>Service Type</span>
                        <span>{selectedService?.type}</span>
                      </div>
                      {selectedService?.savedServices?.map((item, index) => {
                        const bgClass =
                          index % 2 === 0
                            ? 'my-2 font-medium p-4'
                            : 'my-2 font-medium bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-4';
                        return (
                          <div key={item.id} className={bgClass}>
                            <div className="lg:flex justify-around items-center gap-6">
                              <p>Duration: {item.duration}</p>
                              <p>Price: ${item.price}</p>
                              <p>Discount: {item.discount}</p>
                              <p>Final Price: ${item.finalPrice}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-10">
                  <h5 className="text-lg font-medium uppercase border-b py-1">
                    Description
                  </h5>
                  <p className="mt-2 text-base text-gray-500">
                    {selectedService?.description}
                  </p>
                </div>

                {/* Review Section */}
                <div className="my-10">
                  <div className="w-full bg-[#f2f9fb] p-6 rounded-lg">
                    <h2 className="text-2xl mb-2">Average Rating</h2>
                    <div className="flex items-center gap-2 mt-5">
                      <StarRatings
                        rating={Number(selectedService?.avgRating) || 0}
                        starRatedColor="#E8B006"
                        name={`rating-${selectedService?._id}`}
                        starSpacing="1px"
                        starDimension="24px"
                      />
                      <p className="text-[#6B7280] text-base">
                        ({selectedService?.avgRating?.toFixed(1) || 0} /{' '}
                        {selectedService?.reviews?.length || 0} reviews)
                      </p>
                    </div>
                    <div className="mt-5 space-y-2">
                      {progress.map(({ star, percentage }) => (
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

export default ServiceViewModal;
