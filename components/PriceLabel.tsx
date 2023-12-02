import { formatPrice } from "@/lib/formatPrice"

interface PriceLabelProps {
  price: number;
  className?: string;
}

export default function PriceLabel({ price, className }: PriceLabelProps) {
  return <span className={`badge badge-secondary ${className}`}>{formatPrice(price)}</span>;
}