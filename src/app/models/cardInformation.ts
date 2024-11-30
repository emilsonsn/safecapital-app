export interface ISmallInformationCard {
  icon: string;
  icon_description?: string;
  title: number | string;
  category: string;
  description: string;
  color?: string;
  background?: string;
}

export interface requestCards {
  solicitationFinished: number
  solicitationPending: number
  solicitationReject: number
}
