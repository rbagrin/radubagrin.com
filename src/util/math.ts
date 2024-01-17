export const MATH = {
  /*
   * ir   - interest rate per month
   * np   - number of periods (months)
   * pv   - present value
   * fv   - future value
   * type - when the payments are due:
   *        0: end of the period, e.g. end of month (default)
   *        1: beginning of period
   */
  PMT: function (
    ir: number,
    np: number,
    pv: number,
    fv = 0,
    type = 0 // 0
  ): number {
    if (!fv) fv = 0;
    if (!type) type = 0;

    if (ir === 0) return -(pv + fv) / np;

    const pvif = Math.pow(1 + ir, np);
    let pmt = (ir / (pvif - 1)) * -(pv * pvif + fv);

    if (type === 1) pmt /= 1 + ir;

    return pmt;
  },

  IPMT: function (pv: number, pmt: number, ir: number, per: number): number {
    const tmp = Math.pow(1 + ir, per);
    return 0 - (pv * tmp * ir + pmt * (tmp - 1));
  },

  PPMT: function (
    ir: number,
    per: number,
    np: number,
    pv: number,
    fv: number,
    type = 0
  ): number | null {
    if (per < 1 || per >= np + 1) return null;
    const pmt = this.PMT(ir, np, pv, fv, type);
    var ipmt = this.IPMT(pv, pmt, ir, per - 1);
    return pmt - ipmt;
  },
};
