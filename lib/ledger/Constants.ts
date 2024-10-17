// file: @/lib/ledger/core/Constants.ts

export const POST_CONSTANTS = {
    MAX_TITLE_LENGTH: 40,
    MAX_SUBTITLE_LENGTH: 40,
    MAX_CONTENT_TEXT_LENGTH: 400,
    MAX_IMAGE_SIZE_BYTES: 2 * 1024 * 1024 * 1024, // 2GB
    STORAGE_DURATION_HOURS: 72,
    TARGET_COST_USD: 1, // $1 per maximum size post for 72 hours
  };
  
  export const BLOCKCHAIN_CONSTANTS = {
    GENESIS_PREVIOUS_HASH: '0',
    MINING_DIFFICULTY: 4,
    MINING_REWARD: 1,
  };
  
  export const TRANSACTION_CONSTANTS = {
    MIN_MESSAGE_LENGTH: 1,
    MIN_PAYMENT_AMOUNT: 0.01,
  };
  
  export const COLOR_CONSTANTS = {
    HEX_COLOR_REGEX: /^#[0-9A-Fa-f]{8}$/,
  };
  
  export const IMAGE_CONSTANTS = {
    PNG_BASE64_PREFIX: 'data:image/png;base64,',
  };