export class Validators {
  static isValidPrice(price: any): boolean {
    const num = parseFloat(price);
    return !isNaN(num) && num > 0;
  }

  static isValidStock(stock: any): boolean {
    const num = parseInt(stock, 10);
    return !isNaN(num) && num >= 0;
  }

  static isValidProductName(name: string): boolean {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 255;
  }

  static isValidDescription(description: string): boolean {
    return typeof description === 'string' && description.length <= 1000;
  }

  static isValidCategoryName(name: string): boolean {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 100;
  }

  static isValidQuantity(quantity: any): boolean {
    const num = parseInt(quantity, 10);
    return !isNaN(num) && num > 0;
  }

  static parsePrice(price: string): number | null {
    const num = parseFloat(price);
    return this.isValidPrice(num) ? num : null;
  }

  static parseStock(stock: string): number | null {
    const num = parseInt(stock, 10);
    return this.isValidStock(num) ? num : null;
  }

  static parseQuantity(quantity: string): number | null {
    const num = parseInt(quantity, 10);
    return this.isValidQuantity(num) ? num : null;
  }
}
