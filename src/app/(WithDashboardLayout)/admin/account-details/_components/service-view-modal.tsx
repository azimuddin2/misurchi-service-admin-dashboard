'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { TService, TStatus } from '@/types/service.type';
import Image from 'next/image';
import StarRatings from 'react-star-ratings';
import { useEffect, useState } from 'react';
import { TReview } from '@/types/review.type';
import { Progress } from '@/components/ui/progress';
import { PackageX } from 'lucide-react';

interface ServiceViewModalProps {
  selectedService: TService | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const UnavailableIcon = () => <PackageX className="w-3.5 h-3.5" />;

const statusConfig: Record<
  TStatus,
  {
    label: string;
    badge: string;
    dot: string;
    icon: (() => React.ReactElement) | null;
    blockSchedule: boolean;
    bannerClass: string;
    bannerText: string;
  }
> = {
  available: {
    label: 'Available',
    badge: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
    icon: null,
    blockSchedule: false,
    bannerClass: '',
    bannerText: '',
  },
  unavailable: {
    label: 'Unavailable',
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
    icon: UnavailableIcon,
    blockSchedule: true,
    bannerClass: 'bg-red-50 border-red-200 text-red-700',
    bannerText: 'This Service Is Currently Unavailable.',
  },
};

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

  // ✅ status — lowercase match
  const status: TStatus = selectedService?.status ?? 'available';
  const cfg = statusConfig[status];

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
                      {selectedService?.images?.map((image, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`border-2 rounded-md p-1 transition ${
                            selectedImage === image?.url
                              ? 'border-green-800'
                              : 'border-gray-300'
                          }`}
                          onClick={() => setSelectedImage(image?.url)}
                        >
                          <Image
                            src={
                              image?.url ||
                              'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                            }
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
                        {selectedService?.savedServices?.[0]?.discount &&
                          selectedService.savedServices[0].discount !==
                            'none' &&
                          selectedService.savedServices[0].discount.trim() !==
                            '' && (
                            <span className="bg-[#FCE9EACC] text-[#5F1011] p-3 rounded font-semibold uppercase">
                              Special Offer
                            </span>
                          )}
                      </h2>

                      <div className="flex items-center gap-2 mt-5">
                        <StarRatings
                          rating={selectedService?.avgRating}
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

                      <h1 className="text-2xl text-[#212529] my-3">
                        {selectedService?.name}
                      </h1>

                      <div>
                        {/* Original Price */}
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

                          {selectedService?.savedServices?.[0]?.discount &&
                            selectedService.savedServices[0].discount !==
                              'none' &&
                            selectedService.savedServices[0].discount.trim() !==
                              '' && (
                              <p className="px-3 py-1 text-sm font-semibold text-[#E12728] uppercase italic">
                                {selectedService.savedServices[0].discount} Off
                              </p>
                            )}
                        </div>

                        {/* Discounted Price */}
                        {discountPercent > 0 && (
                          <p className="text-xl font-semibold text-gray-800">
                            ${discountedPrice.toFixed(2)}
                          </p>
                        )}
                      </div>

                      {/* ✅ Status pill */}
                      <div className="flex items-center gap-2 mb-4 mt-5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.badge}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`}
                          />
                          {cfg.icon && <cfg.icon />}
                          {cfg.label}
                        </span>
                      </div>

                      {/* ✅ Unavailable banner */}
                      {cfg.blockSchedule && (
                        <div
                          className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium border mb-4 ${cfg.bannerClass}`}
                        >
                          {cfg.icon && <cfg.icon />}
                          {cfg.bannerText}
                        </div>
                      )}

                      <div>
                        {selectedService?.recommendedType?.length && (
                          <div className="mt-3 right-2 z-10 items-end">
                            {selectedService?.recommendedType.map(
                              (type, index) => (
                                <span
                                  key={index}
                                  className="bg-[#E9F4FFCC] text-[#0D3C6B] text-xs font-semibold px-2 py-1 rounded mr-2 uppercase ring-1 ring-[#d2dfeccc]"
                                >
                                  {type}
                                </span>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product second part  */}
                    <div className="text-gray-600">
                      <div className="my-2 font-medium flex justify-between items-center p-5 border-t">
                        <span>Service Code</span>
                        <span className="font-mono text-sm bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                          {selectedService?.serviceId}
                        </span>
                      </div>

                      <div className="my-2 font-medium flex justify-between items-center bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-5">
                        <span>Service Category</span>
                        <span className="font-medium">
                          {selectedService?.type}
                        </span>
                      </div>

                      <div className="my-2 font-medium">
                        {selectedService?.savedServices?.map((item, index) => {
                          const bgClass =
                            index % 2 === 0
                              ? 'my-2 font-medium p-5'
                              : 'my-2 font-medium bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-5';

                          return (
                            <div key={item.id} className={`${bgClass}`}>
                              {/* Right side: details inline */}
                              <div className="lg:flex justify-around items-center gap-6">
                                <p>Duration: {item.duration}</p>
                                <p>Price: ${item.price}</p>
                                <p>Discount: {item.discount} </p>
                                <p>Final Price: ${item.finalPrice}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-10">
                  <h5 className="text-lg font-medium uppercase border-b py-1">
                    Description
                  </h5>
                  <div
                    className="mt-5 text-base text-gray-500 prose prose-sm max-w-none
      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
      [&_li]:my-0.5
      [&_b]:font-semibold [&_strong]:font-semibold
      [&_a]:text-blue-500 [&_a]:underline
      [&_p]:my-1"
                    dangerouslySetInnerHTML={{
                      __html: selectedService?.description || '',
                    }}
                  />
                </div>

                <div className="my-10">
                  {/* Average rating */}
                  <div className="w-full bg-[#f2f9fb] p-6 rounded-lg mb-4 lg:mb-0">
                    <h2 className="text-2xl mb-2">Average Rating</h2>

                    <div className="flex items-center gap-2 mt-5">
                      {selectedService ? (
                        <StarRatings
                          rating={Number(selectedService.avgRating) || 0} // default to 0 if undefined
                          starRatedColor="#E8B006"
                          name={`rating-${selectedService._id}`} // unique name
                          starSpacing="1px"
                          starDimension="24px"
                        />
                      ) : (
                        <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div> // loading skeleton
                      )}

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
