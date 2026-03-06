// - DUMMY DATA FOR MOBILE CATALOG TESTING - \\

interface dummy_vendor {
  name         : string;
  price        : number;
  stock_status : 'available' | 'out_of_stock' | 'pre_order';
  features_list: string[];
  description? : string;
}

interface dummy_game_vendors {
  game_id : string;
  vendors : dummy_vendor[];
}

// - DUMMY VENDOR DATA - \\

const __dummy_vendor_data: dummy_game_vendors[] = [
  {
    game_id: 'pubg_mobile',
    vendors : [
      {
        name         : 'TANTEDARA PLUGIN INDONESIA',
        price        : 70000,
        stock_status : 'available',
        features_list: [
          '3 Days Access',
          'Android Plugin',
          'Indonesian Server'
        ],
        description: 'Tantedara Plugin - 3 Days'
      },
      {
        name         : 'TANTEDARA PLUGIN INDONESIA',
        price        : 120000,
        stock_status : 'available',
        features_list: [
          '7 Days Access',
          'Android Plugin',
          'Indonesian Server'
        ],
        description: 'Tantedara Plugin - 7 Days'
      },
      {
        name         : 'TANTEDARA PLUGIN INDONESIA',
        price        : 150000,
        stock_status : 'available',
        features_list: [
          '10 Days Access',
          'Android Plugin',
          'Indonesian Server'
        ],
        description: 'Tantedara Plugin - 10 Days'
      },
      {
        name         : 'TANTEDARA PLUGIN INDONESIA',
        price        : 250000,
        stock_status : 'available',
        features_list: [
          '30 Days Access',
          'Android Plugin',
          'Indonesian Server'
        ],
        description: 'Tantedara Plugin - 30 Days'
      },
      {
        name         : 'KING Android',
        price        : 40000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'AIMBOT',
          'Bullet Tracking',
          'Skin Hack (Full Effect)',
          'Non Root & Root Support',
          'Key Support'
        ],
        description: '1 Day Access - Key Support KING Android'
      },
      {
        name         : 'KING Android',
        price        : 150000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'AIMBOT',
          'Bullet Tracking',
          'Skin Hack (Full Effect)',
          'Non Root & Root Support',
          'Key Support'
        ],
        description: '7 Days Access - Key Support KING Android'
      },
      {
        name         : 'KING Android',
        price        : 350000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'AIMBOT',
          'Bullet Tracking',
          'Skin Hack (Full Effect)',
          'Non Root & Root Support',
          'Key Support'
        ],
        description: '30 Days Access - Key Support KING Android'
      },
      {
        name         : 'SHIELD (Non Root)',
        price        : 40000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'Aimbot Smooth Aim',
          'Recoil Compensation',
          'Bullet Speed',
          'IPAD View',
          'Hide ESP Recording',
          'Fight Mode (Aim Full Power)',
          'Global | KR | VN | TW',
          'Loader (Non Root)'
        ],
        description: '1 Day Access - SHIELD Global/KR/VN/TW'
      },
      {
        name         : 'SHIELD (Non Root)',
        price        : 130000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'Aimbot Smooth Aim',
          'Recoil Compensation',
          'Bullet Speed',
          'IPAD View',
          'Hide ESP Recording',
          'Fight Mode (Aim Full Power)',
          'Global | KR | VN | TW',
          'Loader (Non Root)'
        ],
        description: '7 Days Access - SHIELD Global/KR/VN/TW'
      },
      {
        name         : 'SHIELD (Non Root)',
        price        : 280000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'Aimbot Smooth Aim',
          'Recoil Compensation',
          'Bullet Speed',
          'IPAD View',
          'Hide ESP Recording',
          'Fight Mode (Aim Full Power)',
          'Global | KR | VN | TW',
          'Loader (Non Root)'
        ],
        description: '30 Days Access - SHIELD Global/KR/VN/TW'
      },
      {
        name         : 'KING iOS',
        price        : 40000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'Aimbot / Bullet Tracking',
          'Skin Hack Full Effect',
          'Hide ESP Recording',
          'PUBG iOS - GL / KR / VNG / TW (IPA)'
        ],
        description: '1 Day Access - KING iOS'
      },
      {
        name         : 'KING iOS',
        price        : 150000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'Aimbot / Bullet Tracking',
          'Skin Hack Full Effect',
          'Hide ESP Recording',
          'PUBG iOS - GL / KR / VNG / TW (IPA)'
        ],
        description: '7 Days Access - KING iOS'
      },
      {
        name         : 'KING iOS',
        price        : 350000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'Aimbot / Bullet Tracking',
          'Skin Hack Full Effect',
          'Hide ESP Recording',
          'PUBG iOS - GL / KR / VNG / TW (IPA)'
        ],
        description: '30 Days Access - KING iOS'
      },
      {
        name         : 'OASIS iOS',
        price        : 65000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'Aimbot',
          'Recoil Compensation',
          'Skin & Kill Message',
          'Hide ESP Recording / Live',
          'PUBG Global | Korea | Vietnam (IPA)'
        ],
        description: '1 Day Access - OASIS iOS'
      },
      {
        name         : 'OASIS iOS',
        price        : 180000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'Aimbot',
          'Recoil Compensation',
          'Skin & Kill Message',
          'Hide ESP Recording / Live',
          'PUBG Global | Korea | Vietnam (IPA)'
        ],
        description: '7 Days Access - OASIS iOS'
      },
      {
        name         : 'OASIS iOS',
        price        : 380000,
        stock_status : 'available',
        features_list: [
          'ESP',
          'Aimbot',
          'Recoil Compensation',
          'Skin & Kill Message',
          'Hide ESP Recording / Live',
          'PUBG Global | Korea | Vietnam (IPA)'
        ],
        description: '30 Days Access - OASIS iOS'
      }
    ]
  },
  {
    game_id: 'mobile_legends',
    vendors : [
      {
        name         : 'MLBB Diamonds 86',
        price        : 1.20,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Official Diamonds',
          'No Ban Guarantee',
          '24/7 Support'
        ],
        description: '86 Diamonds for Mobile Legends'
      },
      {
        name         : 'MLBB Diamonds 172',
        price        : 2.40,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus Diamonds',
          'No Ban Guarantee',
          '24/7 Support'
        ],
        description: '172 Diamonds for Mobile Legends'
      },
      {
        name         : 'MLBB Diamonds 257',
        price        : 3.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus Diamonds',
          'No Ban Guarantee',
          'Fast Delivery'
        ],
        description: '257 Diamonds for Mobile Legends'
      },
      {
        name         : 'MLBB Diamonds 706',
        price        : 9.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Huge Bonus',
          'No Ban Guarantee',
          'Priority Support'
        ],
        description: '706 Diamonds for Mobile Legends'
      },
      {
        name         : 'MLBB Weekly Pass',
        price        : 2.00,
        stock_status : 'available',
        features_list: [
          'Daily Rewards',
          '7 Days Access',
          'Exclusive Benefits'
        ],
        description: 'Weekly Diamond Pass membership'
      },
      {
        name         : 'MLBB Monthly Pass',
        price        : 7.50,
        stock_status : 'pre_order',
        features_list: [
          'Daily Rewards',
          '30 Days Access',
          'Exclusive Skins'
        ],
        description: 'Monthly Diamond Pass membership'
      }
    ]
  },
  {
    game_id: 'free_fire',
    vendors : [
      {
        name         : 'FF Diamonds 100',
        price        : 1.00,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Official Diamonds',
          'Safe Transaction'
        ],
        description: '100 Diamonds for Free Fire'
      },
      {
        name         : 'FF Diamonds 310',
        price        : 3.00,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus Diamonds',
          'Safe Transaction'
        ],
        description: '310 Diamonds for Free Fire'
      },
      {
        name         : 'FF Diamonds 520',
        price        : 5.00,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus Diamonds',
          'Priority Support'
        ],
        description: '520 Diamonds for Free Fire'
      },
      {
        name         : 'FF Membership 7 Days',
        price        : 1.50,
        stock_status : 'out_of_stock',
        features_list: [
          'Daily Rewards',
          'Exclusive Items'
        ],
        description: '7 Days Free Fire membership'
      }
    ]
  },
  {
    game_id: 'valorant_mobile',
    vendors : [
      {
        name         : 'VM VP 475',
        price        : 4.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Official VP',
          'No Ban Guarantee'
        ],
        description: '475 Valorant Points for Valorant Mobile'
      },
      {
        name         : 'VM VP 1000',
        price        : 9.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus VP',
          'Priority Support'
        ],
        description: '1000 Valorant Points for Valorant Mobile'
      },
      {
        name         : 'VM VP 2650',
        price        : 24.00,
        stock_status : 'pre_order',
        features_list: [
          'Instant Delivery',
          'Huge Bonus',
          'VIP Support'
        ],
        description: '2650 Valorant Points for Valorant Mobile'
      }
    ]
  },
  {
    game_id: 'delta_force_mobile',
    vendors : [
      {
        name         : 'DFM Gold Coins 100',
        price        : 1.20,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Official Coins'
        ],
        description: '100 Gold Coins for Delta Force Mobile'
      },
      {
        name         : 'DFM Gold Coins 500',
        price        : 5.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus Coins'
        ],
        description: '500 Gold Coins for Delta Force Mobile'
      }
    ]
  },
  {
    game_id: 'blood_strike',
    vendors : [
      {
        name         : 'BS Gold 100',
        price        : 1.00,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Safe Transaction'
        ],
        description: '100 Gold for Blood Strike'
      },
      {
        name         : 'BS Gold 500',
        price        : 4.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus Gold'
        ],
        description: '500 Gold for Blood Strike'
      },
      {
        name         : 'BS Battle Pass',
        price        : 10.00,
        stock_status : 'out_of_stock',
        features_list: [
          'Full Season Access',
          'Exclusive Rewards'
        ],
        description: 'Season Battle Pass for Blood Strike'
      }
    ]
  },
  {
    game_id: 'cod_mobile',
    vendors : [
      {
        name         : 'CODM CP 80',
        price        : 1.00,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Official CP'
        ],
        description: '80 COD Points for Call of Duty Mobile'
      },
      {
        name         : 'CODM CP 400',
        price        : 4.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus CP',
          'Fast Delivery'
        ],
        description: '400 COD Points for Call of Duty Mobile'
      },
      {
        name         : 'CODM CP 880',
        price        : 9.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Huge Bonus',
          'Priority Support'
        ],
        description: '880 COD Points for Call of Duty Mobile'
      },
      {
        name         : 'CODM Battle Pass',
        price        : 10.00,
        stock_status : 'pre_order',
        features_list: [
          'Full Season Access',
          'Exclusive Rewards',
          'XP Boost'
        ],
        description: 'Season Battle Pass for COD Mobile'
      }
    ]
  },
  {
    game_id: 'eight_ball_pool',
    vendors : [
      {
        name         : '8BP Coins 50K',
        price        : 1.00,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Safe Transaction'
        ],
        description: '50,000 Coins for 8 Ball Pool'
      },
      {
        name         : '8BP Coins 200K',
        price        : 3.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus Coins'
        ],
        description: '200,000 Coins for 8 Ball Pool'
      },
      {
        name         : '8BP Cash 10',
        price        : 2.00,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Official Cash'
        ],
        description: '10 Cash for 8 Ball Pool'
      }
    ]
  },
  {
    game_id: 'cross_fire',
    vendors : [
      {
        name         : 'CF Points 1000',
        price        : 1.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Official Points'
        ],
        description: '1,000 CF Points for Cross Fire'
      },
      {
        name         : 'CF Points 5000',
        price        : 7.00,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus Points',
          'Priority Support'
        ],
        description: '5,000 CF Points for Cross Fire'
      },
      {
        name         : 'CF VIP Membership',
        price        : 15.00,
        stock_status : 'out_of_stock',
        features_list: [
          '30 Days VIP',
          'Exclusive Weapons',
          'XP Boost'
        ],
        description: '30 Days VIP Membership for Cross Fire'
      }
    ]
  },
  {
    game_id: 'honor_of_kings',
    vendors : [
      {
        name         : 'HoK Tokens 100',
        price        : 1.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Official Tokens'
        ],
        description: '100 Tokens for Honor of Kings'
      },
      {
        name         : 'HoK Tokens 500',
        price        : 7.00,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus Tokens',
          'Fast Delivery'
        ],
        description: '500 Tokens for Honor of Kings'
      },
      {
        name         : 'HoK Tokens 1000',
        price        : 13.50,
        stock_status : 'pre_order',
        features_list: [
          'Instant Delivery',
          'Huge Bonus',
          'VIP Support'
        ],
        description: '1,000 Tokens for Honor of Kings'
      },
      {
        name         : 'HoK Battle Pass',
        price        : 10.00,
        stock_status : 'available',
        features_list: [
          'Full Season Access',
          'Exclusive Rewards'
        ],
        description: 'Season Battle Pass for Honor of Kings'
      }
    ]
  },
  {
    game_id: 'arena_of_valor',
    vendors : [
      {
        name         : 'AoV Vouchers 100',
        price        : 1.50,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Official Vouchers'
        ],
        description: '100 Vouchers for Arena of Valor'
      },
      {
        name         : 'AoV Vouchers 500',
        price        : 7.00,
        stock_status : 'available',
        features_list: [
          'Instant Delivery',
          'Bonus Vouchers',
          'Fast Delivery'
        ],
        description: '500 Vouchers for Arena of Valor'
      },
      {
        name         : 'AoV Season Pass',
        price        : 12.00,
        stock_status : 'available',
        features_list: [
          'Full Season Access',
          'Exclusive Rewards',
          'Skin Discounts'
        ],
        description: 'Season Pass for Arena of Valor'
      }
    ]
  }
];

// - HELPER FUNCTIONS - \\

/**
 * Get dummy vendors by game ID
 * @param game_id string
 * @return dummy_vendor[]
 */
const get_dummy_vendors_by_game = (game_id: string): dummy_vendor[] => {
  const game_data = __dummy_vendor_data.find((data) => data.game_id === game_id);
  return game_data?.vendors || [];
};

/**
 * Get dummy vendor by game ID and vendor name
 * @param game_id string
 * @param vendor_name string
 * @return dummy_vendor | null
 */
const get_dummy_vendor_detail = (game_id: string, vendor_name: string): dummy_vendor | null => {
  const vendors = get_dummy_vendors_by_game(game_id);
  return vendors.find((vendor) => vendor.name === vendor_name) || null;
};

// - EXPORTS - \\

export {
  dummy_vendor,
  dummy_game_vendors,
  __dummy_vendor_data,
  get_dummy_vendors_by_game,
  get_dummy_vendor_detail
};
