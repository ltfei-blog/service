export interface QqConnectUserInfo {
  ret: number
  msg: string
  is_lost: number
  nickname: string
  gender: string
  gender_type: number
  /**
   * @deprecated
   */
  province: string
  /**
   * @deprecated
   */
  city: string
  /**
   * @deprecated
   */
  year: string
  /**
   * @deprecated
   */
  constellation: string
  figureurl?: string
  figureurl_1?: string
  figureurl_2?: string
  figureurl_qq_1: string
  figureurl_qq_2?: string
  figureurl_qq?: string
  figureurl_type: string
  is_yellow_vip: string
  vip: string
  yellow_vip_level: string
  level: string
  is_yellow_year_vip: string
}
