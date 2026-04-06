import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { config, API_ENDPOINTS } from "../../config/config";
import { ApiBrandsResponse, ApiProductsResponse, ApiResponse, ApiUserResponse, UserRegistrationData } from "../types";


export class ApiClient {
    private baseUrl: string;
    private apiContext: APIRequestContext | null = null;
    private csrfToken: string = '';

    constructor() {
        this.baseUrl = config.apiBaseUrl;
    }

    //---Init/Teardown------------
    async init(): Promise<void> {
        this.apiContext = await request.newContext({
            baseURL: this.baseUrl,
            extraHTTPHeaders: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0    ',
            },
            timeout: config.defaultTimeout,
        });

        const homeRes = await this.apiContext.get('https://automationexercise.com');
        console.log('Home page status:', homeRes.status());

        // Extract the CSRF token from cookies
        const cookies = await this.apiContext.storageState();
        const csrfCookie = cookies.cookies.find(c => c.name === 'csrftoken');

        if (csrfCookie) {
            this.csrfToken = csrfCookie.value;
            console.log('CSRF token obtained:', this.csrfToken.slice(0, 10) + '...');
        } else {
            console.warn('Warning: No CSRF token found in cookies');
        }
    }

    async dispose(): Promise<void> {
        if (this.apiContext) {
            await this.apiContext.dispose();
            this.apiContext = null;
        }
    }

    private getContext(): APIRequestContext {
        if (!this.apiContext) throw ('Api Client not initialiezd. Call init() first.');
        return this.apiContext;
    }

    // Build headers with CSRF token for every request
    private getHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Referer': 'https://automationexercise.com',
            'Origin': 'https://automationexercise.com',
            'X-CSRFToken': this.csrfToken,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        };
    }

    //--Auth/Login--------------------------    
    async verifyLogin(email: string, password: string): Promise<ApiResponse> {
        const res = await this.getContext().post(`${this.baseUrl}${API_ENDPOINTS.verifyLogin}`, {
            headers: this.getHeaders(),
            form: { email, password }
        });
        return this.parseJson(res);
    }

    async verifyLoginWithoutParams(): Promise<ApiResponse> {
        const res = await this.getContext().post(`${this.baseUrl}${API_ENDPOINTS.verifyLogin}`, { form: {} });
        return this.parseJson(res);
    }

    async verifyLoginViaDelete(): Promise<ApiResponse> {
        const res = await this.getContext().delete(`${this.baseUrl}${API_ENDPOINTS.verifyLogin}`);
        return this.parseJson<ApiResponse>(res);
    }

    //--Sign Up------------------------
    async createAccount(user: Partial<UserRegistrationData> & { email: string; password: string; name: string }): Promise<ApiResponse> {
        const form: Record<string, string> = {
            name: user.name,
            email: user.email,
            password: user.password,
            title: user.title ?? 'Mr',
            birth_date: user.birthDay ?? '1',
            birth_month: user.birthMonth ?? 'January',
            birth_year: user.birthYear ?? '1990',
            firstname: user.firstName ?? 'Test',
            lastname: user.lastName ?? 'User',
            company: user.company ?? 'TestCorp',
            address1: user.address1 ?? '123 Test Street',
            address2: user.address2 ?? '',
            country: user.country ?? 'India',
            zipcode: user.zipCode ?? '500001',
            state: user.state ?? 'Telangana',
            city: user.city ?? 'Hyderabad',
            mobile_number: user.mobileNumber ?? '9876543210',
        };

        const res = await this.getContext().post(`${this.baseUrl}${API_ENDPOINTS.createAccount}`, { form });
        return this.parseJson<ApiResponse>(res);
    }

    async updateAccount(user: Partial<UserRegistrationData> & { email: string; password: string; name: string }): Promise<ApiResponse> {
        const form: Record<string, string> = {
            name: user.name,
            email: user.email,
            password: user.password,
            title: user.title ?? 'Mr',
            birth_date: user.birthDay ?? '1',
            birth_month: user.birthMonth ?? 'January',
            birth_year: user.birthYear ?? '1990',
            firstname: user.firstName ?? 'Updated',
            lastname: user.lastName ?? 'User',
            company: user.company ?? 'UpdatedCorp',
            address1: user.address1 ?? '456 New Street',
            address2: user.address2 ?? '',
            country: user.country ?? 'India',
            zipcode: user.zipCode ?? '600001',
            state: user.state ?? 'Tamil Nadu',
            city: user.city ?? 'Chennai',
            mobile_number: user.mobileNumber ?? '9123456789',
        };

        const res = await this.getContext().put(`${this.baseUrl}${API_ENDPOINTS.updateAccount}`, { form });
        return this.parseJson<ApiResponse>(res);
    }

    async deleteAccount(email: string, password: string): Promise<ApiResponse> {
        const res = await this.getContext().delete(`${this.baseUrl}${API_ENDPOINTS.deleteAccount}`, {
            form: { email, password },
        });
        return this.parseJson<ApiResponse>(res);
    }

    async getUserDetailByEmail(email: string): Promise<ApiUserResponse> {
        const res = await this.getContext().get(
            `${this.baseUrl}${API_ENDPOINTS.getUserDetail}?email=${encodeURIComponent(email)}`
        );
        return this.parseJson<ApiUserResponse>(res);
    }

    // Products
    async getAllProducts(): Promise<ApiProductsResponse> {
        const res = await this.getContext().get(`${this.baseUrl}${API_ENDPOINTS.productsList}`);
        return this.parseJson<ApiProductsResponse>(res);
    }

    async postToProductsList(body?: Record<string, string>): Promise<ApiResponse> {
        const res = await this.getContext().post(`${this.baseUrl}${API_ENDPOINTS.productsList}`, {
            form: body ?? {},
        });
        return this.parseJson<ApiResponse>(res);
    }

    // Brands
    async getAllBrands(): Promise<ApiBrandsResponse> {
        const res = await this.getContext().get(`${this.baseUrl}${API_ENDPOINTS.brandsList}`);
        return this.parseJson<ApiBrandsResponse>(res);
    }

    async putBrandsList(): Promise<ApiResponse> {
        const res = await this.getContext().put(`${this.baseUrl}${API_ENDPOINTS.brandsList}`, { form: {} });
        return this.parseJson<ApiResponse>(res);
    }

    // Search
    async searchProduct(searchTerm: string): Promise<ApiProductsResponse> {
        const res = await this.getContext().post(`${this.baseUrl}${API_ENDPOINTS.searchProduct}`, {
            form: { search_product: searchTerm },
        });
        return this.parseJson<ApiProductsResponse>(res);
    }

    async searchProductWithoutParam(): Promise<ApiResponse> {
        const res = await this.getContext().post(`${this.baseUrl}${API_ENDPOINTS.searchProduct}`, { form: {} });
        return this.parseJson<ApiResponse>(res);
    }

    async searchProductViaGet(searchTerm: string): Promise<ApiResponse> {
        const res = await this.getContext().get(
            `${this.baseUrl}${API_ENDPOINTS.searchProduct}?search_product=${searchTerm}`
        );
        return this.parseJson<ApiResponse>(res);
    }

    private async parseJson<T>(res: APIResponse): Promise<T> {
        const status = res.status();
        const text = await res.text();
        console.log(`[API] ${res.url()}`);

        if (status === 403) {
            throw new Error(`403 Forbidden - CSRF check failed.\nResponse: ${text.slice(0, 300)}`);
        }
        if (status === 404) {
            throw new Error(`404 Not Found - ${res.url()}`);
        }

        try {
            return JSON.parse(text) as T;
        } catch {
            throw new Error(`Failed to parse API response: ${text}`);
        }
    }
}