// // src/stores/propertyStore.ts
// import { create } from 'zustand';
// import { devtools, persist } from 'zustand/middleware';

// interface Property {
//   id: string;
//   title: string;
//   type: string;
//   location: string;
//   price: number;
//   status: 'available' | 'sold' | 'rented';
//   bedrooms?: number;
//   bathrooms?: number;
//   area?: number;
//   featuredImage?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface PropertyState {
//   properties: Property[];
//   isLoading: boolean;
//   error: string | null;
//   fetchProperties: () => Promise<void>;
//   addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
//   updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
//   deleteProperty: (id: string) => Promise<void>;
// }

// // Mock API functions
// const mockFetchProperties = async (): Promise<Property[]> => {
//   // Simulate API call
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   // Return mock data
//   return [
//     {
//       id: '1',
//       title: 'Luxury Apartment in Mumbai',
//       type: 'Flat/Apartment',
//       location: 'Mumbai, Maharashtra',
//       price: 15000000,
//       status: 'available',
//       bedrooms: 3,
//       bathrooms: 2,
//       area: 1800,
//       createdAt: new Date('2025-01-15'),
//       updatedAt: new Date('2025-01-15')
//     },
//     {
//       id: '2',
//       title: 'Penthouse in Hyderabad',
//       type: 'Flat/Apartment',
//       location: 'Hyderabad, Telangana',
//       price: 25000000,
//       status: 'available',
//       bedrooms: 4,
//       bathrooms: 3,
//       area: 3200,
//       createdAt: new Date('2025-02-10'),
//       updatedAt: new Date('2025-02-10')
//     },
//     {
//       id: '3',
//       title: 'Commercial Plot in Delhi',
//       type: 'Plot',
//       location: 'Delhi',
//       price: 50000000,
//       status: 'sold',
//       area: 5000,
//       createdAt: new Date('2025-01-05'),
//       updatedAt: new Date('2025-03-20')
//     }
//   ];
// };

// const usePropertyStore = create<PropertyState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         properties: [],
//         isLoading: false,
//         error: null,

//         fetchProperties: async () => {
//           set({ isLoading: true, error: null });
//           try {
//             const properties = await mockFetchProperties();
//             set({ properties, isLoading: false });
//           } catch (error) {
//             set({ error: (error as Error).message, isLoading: false });
//           }
//         },

//         addProperty: async (property) => {
//           set({ isLoading: true, error: null });
//           try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 300));
            
//             const newProperty: Property = {
//               ...property,
//               id: Date.now().toString(),
//               createdAt: new Date(),
//               updatedAt: new Date()
//             };
            
//             set(state => ({
//               properties: [...state.properties, newProperty],
//               isLoading: false
//             }));
//           } catch (error) {
//             set({ error: (error as Error).message, isLoading: false });
//           }
//         },

//         updateProperty: async (id, updates) => {
//           set({ isLoading: true, error: null });
//           try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 300));
            
//             set(state => ({
//               properties: state.properties.map(property => 
//                 property.id === id 
//                   ? { 
//                       ...property, 
//                       ...updates, 
//                       updatedAt: new Date() 
//                     } 
//                   : property
//               ),
//               isLoading: false
//             }));
//           } catch (error) {
//             set({ error: (error as Error).message, isLoading: false });
//           }
//         },

//         deleteProperty: async (id) => {
//           set({ isLoading: true, error: null });
//           try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 300));
            
//             set(state => ({
//               properties: state.properties.filter(property => property.id !== id),
//               isLoading: false
//             }));
//           } catch (error) {
//             set({ error: (error as Error).message, isLoading: false });
//           }
//         }
//       }),
//       {
//         name: 'property-storage'
//       }
//     )
//   )
// );

// export default usePropertyStore;


// // src/stores/index.ts
// // export { default as useUserStore } from './userStore';
// // export { default as useAgentStore } from './agentStore';

// store/propertyStore.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface PropertyStore {
//   viewedProperties: string[];
//   addViewedProperty: (id: string) => void;
//   clearViewedProperties: () => void;
// }

// export const usePropertyStore = create<PropertyStore>()(
//   persist(
//     (set, get) => ({
//       viewedProperties: [],
//       addViewedProperty: (id: string) => {
//         const current = get().viewedProperties;
//         if (!current.includes(id)) {
//           set({ viewedProperties: [...current, id] });
//         }
//       },
//       clearViewedProperties: () => set({ viewedProperties: [] }),
//     }),
//     {
//       name: 'viewed-properties', // localStorage key
//     }
//   )
// );

// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';

// // Define interfaces for type safety
// interface PropertyView {
//   propertyId: string;
//   viewedAt: Date;
// }

// interface Property {
//   _id: string;
//   createdAt?: string;
//   // Add other fields as needed (e.g., name, price)
// }

// // Define the store's state and actions
// interface PropertyStore {
//   viewedProperties: PropertyView[];
//   favoriteProperties: string[];
//   setViewedProperties: (properties: PropertyView[]) => void;
//   setFavoriteProperties: (favorites: string[]) => void;
// }

// // Create the Zustand store with persistence
// const usePropertyStore = create<PropertyStore>()(
//   persist(
//     (set) => ({
//       viewedProperties: [],
//       favoriteProperties: [],
//       setViewedProperties: (properties) => set({ viewedProperties: properties }),
//       setFavoriteProperties: (favorites) => set({ favoriteProperties: favorites }),
//     }),
//     {
//       name: 'property-storage', // Key in localStorage
//       storage: createJSONStorage(() => localStorage), // Use localStorage
//       // Optional: Transform Date objects for JSON serialization
//       partialize: (state) => ({
//         viewedProperties: state.viewedProperties.map((view) => ({
//           propertyId: view.propertyId,
//           viewedAt: view.viewedAt.toISOString(),
//         })),
//         favoriteProperties: state.favoriteProperties,
//       }),
//       onRehydrateStorage: () => (state) => {
//         if (state?.viewedProperties) {
//           state.viewedProperties = state.viewedProperties.map((view) => ({
//             ...view,
//             viewedAt: new Date(view.viewedAt),
//           }));
//         }
//       },
//     }
//   )
// );

// export default usePropertyStore;

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define interfaces for type safety
interface PropertyView {
  propertyId: string;
  viewedAt: Date;
}

interface Property {
  _id: string;
  createdAt?: string;
  // Add other fields as needed (e.g., name, price)
}

// Define the store's state and actions
interface PropertyStore {
  viewedProperties: PropertyView[];
  favoriteProperties: string[];
  setViewedProperties: (properties: PropertyView[]) => void;
  setFavoriteProperties: (favorites: string[]) => void;
  reset: () => void;
}

// Create the Zustand store with persistence
const usePropertyStore = create<PropertyStore>()(
  persist(
    (set) => ({
      viewedProperties: [],
      favoriteProperties: [],
      setViewedProperties: (properties) => set({ viewedProperties: properties }),
      setFavoriteProperties: (favorites) => set({ favoriteProperties: favorites }),
      reset: () => set({ viewedProperties: [], favoriteProperties: [] }),
    }),
    {
      name: 'property-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
      // Transform Date objects for JSON serialization
      partialize: (state) => ({
        viewedProperties: state.viewedProperties.map((view) => ({
          propertyId: view.propertyId,
          viewedAt: view.viewedAt.toISOString(),
        })),
        favoriteProperties: state.favoriteProperties,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.viewedProperties) {
          state.viewedProperties = state.viewedProperties.map((view) => ({
            ...view,
            viewedAt: new Date(view.viewedAt),
          }));
        }
      },
    }
  )
);

export default usePropertyStore;