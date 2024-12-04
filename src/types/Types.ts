export interface ThirdParty {
  id: number;
  name: string;
  address: string;
  contact_name: string;
  contact_info: string;
  category: "client" | "vendor";
}

export interface ThirdListProps {
  thirdParties: ThirdParty[];
  addToRoute: (thirdParty: ThirdParty) => void;
  refreshThirdParties: () => void;
  setRouteList: (thirdParty: ThirdParty[]) => void;
}

export interface RouteHistory {
  route_id: number;
  route_date: string;
  third_party_id: number;
  third_party_name: string;
  address: string;
  contact_name?: string;
  contact_info?: string;
  comment: string;
  is_finished: boolean;
  observations: string;
}
