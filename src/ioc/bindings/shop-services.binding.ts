import { CartService } from "@services/shop/cart.service";
import { SearchService } from "@services/shop/global-search.service";
import { FileService } from "@services/shop/image.service";
import { OrderService } from "@services/shop/order.service";
import { ProductService } from "@services/shop/product.service";
import { ProfessionalServicesService } from "@services/shop/professional-services.service";
import { RentingService } from "@services/shop/renting.service";
import { ReviewService } from "@services/shop/review.service";
import { WishlistService } from "@services/shop/wishlist.service";
import { Container } from "inversify";

function bindShopServices(container: Container) {
    container.bind(ReviewService).toSelf();
    container.bind(FileService).toSelf();
    container.bind(ProductService).toSelf();
    container.bind(ProfessionalServicesService).toSelf();
    container.bind(RentingService).toSelf();
    container.bind(CartService).toSelf();
    container.bind(WishlistService).toSelf();
    container.bind(OrderService).toSelf();
    container.bind(SearchService).toSelf();
}

export { bindShopServices };

