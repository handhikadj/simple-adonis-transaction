export default class Utils {
  public static sumDecimal(numb1: string, numb2: string): string {
    const num1 = this.formatMoney(numb1)
    const num2 = this.formatMoney(numb2)

    return String(num1 + num2)
  }

  public static substrDecimal(numb1: string, numb2: string): string | boolean {
    const num1 = this.formatMoney(numb1)
    const num2 = this.formatMoney(numb2)

    const firstResult = num2 - num1

    const result = String(firstResult)

    return firstResult >= 0.0 ? String(this.formatMoney(result)) : false
  }

  public static formatMoney(str: string): number {
    return Number(parseFloat(str).toFixed(2))
  }
}
