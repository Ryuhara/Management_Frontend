/**
 * Solution APIのレスポンス型
 */
export interface SolutionResponse {
  solution?: string;
  error?: string;
  [key: string]: any;
}

/**
 * Upload APIのレスポンス型
 */
export interface UploadResponse {
  message: string;
  blob_name: string;
  filename: string;
}

export interface UploadErrorResponse {
  error: string;
}

/**
 * Solution Service API - code_idに基づいてソリューションを取得
 * Pythonバックエンドに直接アクセス
 * @param query - 取得するソリューションのコードID
 * @returns ソリューションデータ
 */
export async function getSolution(query: string): Promise<SolutionResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
    const response = await fetch(`${baseUrl}/api/solution_service/query?query=${encodeURIComponent(query)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching solution:', error);
    throw error;
  }
}

/**
 * Upload Service API - ドキュメントをAzure Blob Storageにアップロード
 * Pythonバックエンドに直接アクセス
 * @param file - アップロードするファイル
 * @returns アップロード結果
 */
export async function uploadDocument(
  file: File
): Promise<UploadResponse | UploadErrorResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
    const response = await fetch(`${baseUrl}/api/upload_service`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

/**
 * Embedding APIのレスポンス型
 */
export interface ProcessDocumentResponse {
  status: string;
  result: {
    blob_name: string;
    stored_embeddings: number;
    [key: string]: any;
  };
}

export interface ProcessBatchResponse {
  status: string;
  total_documents: number;
  total_embeddings_stored: number;
  results: Array<{
    blob_name: string;
    stored_embeddings: number;
    [key: string]: any;
  }>;
}

export interface ProcessBatchResult {
  blob_name?: string;
  stored_embeddings?: number;
  [key: string]: any;
}

export interface ListBlobsResponse {
  status: string;
  count: number;
  blobs: string[];
}

export interface EmbeddingErrorResponse {
  error: string;
}

/**
 * Embedding Service API - ドキュメントを処理してembeddingを生成・保存
 * Pythonバックエンドに直接アクセス
 * @param blobName - 処理するBlobの名前
 * @returns 処理結果
 */
export async function processDocument(
  blobName: string
): Promise<ProcessDocumentResponse | EmbeddingErrorResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
    const response = await fetch(`${baseUrl}/api/embedding/batch_process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blob_name: blobName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}

/**
 * Embedding Service API - 複数のドキュメントを一括処理
 * Pythonバックエンドに直接アクセス
 * @param blobNames - 処理するBlobの名前の配列
 * @returns 処理結果
 */
export async function processBatchDocuments(
  blobNames: string[]
): Promise<ProcessBatchResponse | EmbeddingErrorResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
    const response = await fetch(`${baseUrl}/api/embedding/process-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blob_names: blobNames,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // バックエンドのレスポンスを正規化
    // バックエンドが {status, total_documents, total_embeddings_stored, results} を返すことを期待
    if (data.status === 'success') {
      return data as ProcessBatchResponse;
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      // レガシー形式のレスポンスの場合、新しい形式に変換
      return {
        status: 'success',
        total_documents: blobNames.length,
        total_embeddings_stored: Array.isArray(data)
          ? data.reduce((sum: number, r: ProcessBatchResult) => sum + (r.stored_embeddings || 0), 0)
          : 0,
        results: Array.isArray(data) ? data : []
      };
    }
  } catch (error) {
    console.error('Error processing batch documents:', error);
    throw error;
  }
}

/**
 * Embedding Service API - Blob一覧を取得
 * Pythonバックエンドに直接アクセス
 * @param prefix - フィルタリング用のプレフィックス (オプション)
 * @returns Blob一覧
 */
export async function listBlobs(
  prefix?: string
): Promise<ListBlobsResponse | EmbeddingErrorResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
    const url = prefix
      ? `${baseUrl}/api/embedding/list-all-documents?prefix=${encodeURIComponent(prefix)}`
      : `${baseUrl}/api/embedding/list-all-documents`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error listing blobs:', error);
    throw error;
  }
}

/**
 * Backend API 接続テスト
 * バックエンドAPIが正しく動作しているか確認
 * @returns 接続テスト結果
 */
export interface ConnectionTestResponse {
  success: boolean;
  baseUrl: string;
  message: string;
  endpoints?: {
    [key: string]: {
      status: number;
      ok: boolean;
      error?: string;
    };
  };
}

export async function testBackendConnection(): Promise<ConnectionTestResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
  const result: ConnectionTestResponse = {
    success: false,
    baseUrl,
    message: '',
    endpoints: {},
  };

  const endpoints = [
    { name: 'list-documents', url: `${baseUrl}/api/embedding/list-all-documents` },
    { name: 'health', url: `${baseUrl}/health` },
    { name: 'root', url: baseUrl },
  ];

  const testResults = await Promise.allSettled(
    endpoints.map(async (endpoint) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒タイムアウト

        const response = await fetch(endpoint.url, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        return {
          name: endpoint.name,
          status: response.status,
          ok: response.ok,
        };
      } catch (error) {
        return {
          name: endpoint.name,
          status: 0,
          ok: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    })
  );

  testResults.forEach((testResult, index) => {
    if (testResult.status === 'fulfilled') {
      const endpointName = endpoints[index].name;
      result.endpoints![endpointName] = testResult.value;
    }
  });

  const successfulTests = Object.values(result.endpoints || {}).filter((e) => e.ok);
  result.success = successfulTests.length > 0;

  if (result.success) {
    result.message = `Backend connected successfully (${successfulTests.length}/${endpoints.length} endpoints responding)`;
  } else {
    const errors = Object.values(result.endpoints || {})
      .map((e) => e.error)
      .filter(Boolean);
    result.message = `Failed to connect to backend at ${baseUrl}. ${
      errors.length > 0 ? `Errors: ${errors.join(', ')}` : 'All endpoints failed to respond.'
    }`;
  }

  return result;
}
