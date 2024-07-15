import { Cart } from '@cart/schemas/cart.schema';
import { CreateItemDto } from '@item/dto/create-item.dto';

/**
 * ICartService interface.
 * Defines the methods that a CartService should implement.
 */
export interface ICartService {
  /**
   * Finds a cart by the user's ID.
   * @param user_id - The ID of the user.
   * @returns A promise that resolves to the Cart object.
   * @throws {NotFoundException} If no cart is found for the user.
   */
  getByUserId(user_id: string): Promise<Cart>;

  /**
   * Finds a cart by its ID.
   * @param id - The ID of the cart.
   * @returns A promise that resolves to the Cart object.
   * @throws {NotFoundException} If no cart is found with the given ID.
   */
  getCartById(id: string): Promise<Cart>;

  /**
   * Adds an item to a user's cart.
   * @param user_id - The ID of the user.
   * @param newItem - The item to add to the cart.
   * @returns A promise that resolves to the updated Cart object.
   */
  addItem(user_id: string, newItem: CreateItemDto): Promise<Cart>;

  /**
   * Removes an item from a cart.
   * @param id - The ID of the cart.
   * @param itemId - The ID of the item to remove.
   * @returns A promise that resolves to the updated Cart object.
   * @throws {NotFoundException} If no item is found with the given ID in the cart.
   */
  removeItem(id: string, itemId: string): Promise<Cart>;

  /**
   * Updates an item in a cart.
   * @param id - The ID of the cart.
   * @param updateItem - The updated item.
   * @returns A promise that resolves to the updated Cart object.
   * @throws {NotFoundException} If no item is found with the given ID in the cart.
   */
  updateItem(id: string, updateItem: CreateItemDto): Promise<Cart>;

  /**
   * Removes a cart.
   * @param id - The ID of the cart.
   * @returns A promise that resolves to a message indicating the cart was removed.
   * @throws {NotFoundException} If no cart is found with the given ID.
   */
  remove(id: string): Promise<{ message: string }>;
}
