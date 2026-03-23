export type Restaurant = {
    id: number;
    name: string;
    cuisine: string;
    address: string;
  };
  
  export type Review = {
    id: number;
    restaurantId: number;
    userName: string;
    rating: number;
    comment: string;
  };
  
  export type Suggestion = {
    id: number;
    restaurantName: string;
    votes: number;
  };