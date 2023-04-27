export const Data = {
  1: 'LIENCE_PIC',
  2: 'BANK_DETAIL',
  3: 'VEHICLE_DETAIL',
  4: 'PROFILE_PIC'
}

export const ridesData = [
  {
    id: 1,
    pickUpLocation: {
      lat: '',
      lng: '',
      name: 'GGSIPU Dwarka'
    },
    dropLocation: {
      lat: '',
      lng: '',
      name: 'New Delhi Railway Station'
    },
    status: 0,
    pickUpTime: new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
    pickUpDate: new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
    createdAt: new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
    updatedAt: new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
  },
  {
    id: 2,
    pickUpLocation: {
      lat: '',
      lng: '',
      name: 'Nagloi'
    },
    dropLocation: {
      lat: '',
      lng: '',
      name: 'Dwarka'
    },
    status: 1,
    pickUpTime: new Date().toISOString(),
    pickUpDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    pickUpLocation: {
      lat: '',
      lng: '',
      name: 'Rajapuri'
    },
    dropLocation: {
      lat: '',
      lng: '',
      name: 'Kakrola Gao'
    },
    status: 2,
    pickUpTime: new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000)).toISOString(),
    pickUpDate: new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000)).toISOString(),
    createdAt: new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000)).toISOString(),
    updatedAt: new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000)).toISOString(),
  },
]

