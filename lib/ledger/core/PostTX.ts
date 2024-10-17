// file: @/lib/ledger/core/PostTX.ts

import { POST_CONSTANTS, COLOR_CONSTANTS, IMAGE_CONSTANTS } from '../Constants';
import { TransactionData } from './Transaction';

export interface PostTXData {
    title: string;
    backgroundImage?: string; // Base64 encoded PNG
    contentImage?: string; // Base64 encoded PNG
    contentText?: string;
    subtitle?: string;
    colors: {
        border: string;
        title: { bg: string; fg: string };
        content: { bg: string; fg: string };
        footer: { bg: string; fg: string };
    };
}

export class PostTX {
    private data: PostTXData;

    constructor(data: PostTXData) {
        this.validateData(data);
        this.data = data;
    }

    private validateData(data: PostTXData): void {
        if (data.title.length > POST_CONSTANTS.MAX_TITLE_LENGTH) {
            throw new Error(`Title must be ${POST_CONSTANTS.MAX_TITLE_LENGTH} characters or less`);
        }
        if (data.subtitle && data.subtitle.length > POST_CONSTANTS.MAX_SUBTITLE_LENGTH) {
            throw new Error(`Subtitle must be ${POST_CONSTANTS.MAX_SUBTITLE_LENGTH} characters or less`);
        }
        if (data.contentText && data.contentText.length > POST_CONSTANTS.MAX_CONTENT_TEXT_LENGTH) {
            throw new Error(`Content text must be ${POST_CONSTANTS.MAX_CONTENT_TEXT_LENGTH} characters or less`);
        }
        if (!data.contentImage && !data.contentText) {
            throw new Error('Either content image or content text is required');
        }
        this.validateColors(data.colors);
        this.validateImages(data);
    }

    private validateColors(colors: PostTXData['colors']): void {
        const validateHex = (color: string, name: string) => {
            if (!COLOR_CONSTANTS.HEX_COLOR_REGEX.test(color)) {
                throw new Error(`Invalid color format for ${name}. Must be 8-digit hex including alpha.`);
            }
        };

        validateHex(colors.border, 'border');
        validateHex(colors.title.bg, 'title background');
        validateHex(colors.title.fg, 'title foreground');
        validateHex(colors.content.bg, 'content background');
        validateHex(colors.content.fg, 'content foreground');
        validateHex(colors.footer.bg, 'footer background');
        validateHex(colors.footer.fg, 'footer foreground');
    }

    private validateImages(data: PostTXData): void {
        const validateImage = (image: string | undefined, name: string) => {
            if (image) {
                if (!image.startsWith(IMAGE_CONSTANTS.PNG_BASE64_PREFIX)) {
                    throw new Error(`${name} must be a base64 encoded PNG`);
                }
                const base64 = image.split(',')[1];
                const estimatedSize = Math.ceil((base64.length / 4) * 3);
                if (estimatedSize > POST_CONSTANTS.MAX_IMAGE_SIZE_BYTES) {
                    throw new Error(`${name} must be ${POST_CONSTANTS.MAX_IMAGE_SIZE_BYTES / (1024 * 1024 * 1024)}GB or less`);
                }
            }
        };

        validateImage(data.backgroundImage, 'Background image');
        validateImage(data.contentImage, 'Content image');
    }

    public getData(): PostTXData {
        return { ...this.data };
    }

    public setData(data: Partial<PostTXData>): void {
        const newData = { ...this.data, ...data };
        this.validateData(newData);
        this.data = newData;
    }

    public encode(): TransactionData {
        return {
            postContent: JSON.stringify(this.data)
        };
    }

    public static decode(txData: TransactionData): PostTX {
        if (!txData.postContent) {
            throw new Error('Invalid transaction data for PostTX');
        }
        const postData: PostTXData = JSON.parse(txData.postContent);
        return new PostTX(postData);
    }

    public isValid(): boolean {
        try {
            this.validateData(this.data);
            return true;
        } catch (error) {
            return false;
        }
    }

    public toJSON(): object {
        return this.data;
    }

    private calculatePostSize(): number {
        let size = 0;
        size += this.data.title.length;
        size += this.data.subtitle?.length || 0;
        size += this.data.contentText?.length || 0;

        if (this.data.backgroundImage) {
            const base64 = this.data.backgroundImage.split(',')[1];
            size += Math.ceil((base64.length / 4) * 3);
        }
        if (this.data.contentImage) {
            const base64 = this.data.contentImage.split(',')[1];
            size += Math.ceil((base64.length / 4) * 3);
        }

        size += 8 * 7; // Color information

        return size;
    }

    public calculatePostCost(): number {
        const maxPostSize = POST_CONSTANTS.MAX_TITLE_LENGTH +
            POST_CONSTANTS.MAX_SUBTITLE_LENGTH +
            POST_CONSTANTS.MAX_CONTENT_TEXT_LENGTH +
            (POST_CONSTANTS.MAX_IMAGE_SIZE_BYTES * 2) + // Two images
            (8 * 7); // Color information

        const costPerByte = POST_CONSTANTS.TARGET_COST_USD / maxPostSize;
        const postSize = this.calculatePostSize();

        return postSize * costPerByte;
    }
}