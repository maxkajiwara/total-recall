import { env } from "~/env";

export interface ExaContentResponse {
  requestId?: string;
  results: Array<{
    id?: string;
    url: string;
    title: string;
    text: string;
    highlights?: string[];
    publishedDate?: string;
    author?: string;
    image?: string;
    favicon?: string;
  }>;
  statuses?: Array<{
    id: string;
    status: string;
    source?: string;
  }>;
  costDollars?: {
    total: number;
    contents?: {
      text: number;
    };
  };
  searchTime?: number;
}

export class ExaError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ExaError';
  }
}

export async function getWebpageContent(url: string): Promise<ExaContentResponse> {
  const EXA_API_KEY = env.EXA_API_KEY;
  
  if (!EXA_API_KEY) {
    throw new ExaError('EXA_API_KEY environment variable is not configured');
  }

  try {
    console.log('Fetching content for URL:', url);
    
    // Use the /contents endpoint directly with URLs
    const contentResponse = await fetch('https://api.exa.ai/contents', {
      method: 'POST',
      headers: {
        'x-api-key': EXA_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: [url],
        text: true,
      }),
    });

    console.log('EXA API response status:', contentResponse.status);

    if (!contentResponse.ok) {
      const errorText = await contentResponse.text();
      console.error('EXA API error response:', errorText);
      throw new ExaError(
        `EXA contents API request failed: ${contentResponse.statusText}`,
        contentResponse.status,
      );
    }

    const contentData = await contentResponse.json() as ExaContentResponse;
    console.log('EXA API response data:', JSON.stringify(contentData, null, 2));
    
    if (!contentData.results || contentData.results.length === 0) {
      throw new ExaError('No content found for the provided URL');
    }

    const result = contentData.results[0]!;
    if (!result.text) {
      throw new ExaError('No text content found for the provided URL');
    }

    console.log('Successfully extracted content, returning complete response');
    return contentData;
  } catch (error) {
    console.error('EXA API error:', error);
    
    if (error instanceof ExaError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ExaError('Network error: Unable to connect to EXA API');
    }
    
    throw new ExaError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Test function - run with: npx tsx src/lib/exa.ts
async function testExaAPI() {
  console.log('🧪 Testing EXA API directly...\n');
  
  try {
    const testUrl = 'https://www.geeksforgeeks.org/dsa/binary-search/';
    console.log(`Testing with URL: ${testUrl}\n`);
    
    const response = await getWebpageContent(testUrl);
    
    console.log('\n✅ SUCCESS!');
    console.log(`Results count: ${response.results.length}`);
    console.log(`First result text length: ${response.results[0]?.text.length} characters`);
    console.log(`Request ID: ${response.requestId}`);
    console.log(`Cost: $${response.costDollars?.total}`);
    
  } catch (error) {
    console.log('\n❌ FAILED!');
    console.error('Error:', error);
    
    if (error instanceof ExaError) {
      console.error('EXA Error code:', error.code);
      console.error('EXA Error status:', error.status);
    }
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testExaAPI();
}