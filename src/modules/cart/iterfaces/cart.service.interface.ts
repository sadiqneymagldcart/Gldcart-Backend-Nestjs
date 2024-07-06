import { ItemDto } from "@item/dto/item.dto";
import { Cart } from "@cart/schemas/cart.schema";

/**
 * ICartService interface.
 * Defines the methods that a CartService should implement.
 */
export interface ICartService {
  /**
   * Finds a cart by the user's ID.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the Cart object.
   * @throws {NotFoundException} If no cart is found for the user.
   */
  findByUserId(userId: string): Promise<Cart>;

  /**
   * Finds a cart by its ID.
   * @param id - The ID of the cart.
   * @returns A promise that resolves to the Cart object.
   * @throws {NotFoundException} If no cart is found with the given ID.
   */
  findOne(id: string): Promise<Cart>;

  /**
   * Adds an item to a user's cart.
   * @param userId - The ID of the user.
   * @param newItem - The item to add to the cart.
   * @returns A promise that resolves to the updated Cart object.
   */
  addItem(userId: string, newItem: ItemDto): Promise<Cart>;

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
  updateItem(id: string, updateItem: ItemDto): Promise<Cart>;

  /**
   * Removes a cart.
   * @param id - The ID of the cart.
   * @returns A promise that resolves when the cart is removed.
   * @throws {NotFoundException} If no cart is found with the given ID.
   */
  remove(id: string): Promise<void>;
}

