export class ProductData {
    _id: string;
    name: string;
    sku: string;
    description: string;
    price: number;
    discount: number;
    categoryId: ProductCategory;
    brand: string;
    images: string[];
    stock: number;
    rating: number;
    numReviews: number;
    attributes: Attribute;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class ProductCategory {
    _id: string;
    name: string;
}
export class Attribute {
    color: string;
    material: string;
    warranty: string;
}