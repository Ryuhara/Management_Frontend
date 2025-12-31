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
 * Next.js API Routesを経由してバックエンドにアクセス
 * @param query - 取得するソリューションのコードID
 * @returns ソリューションデータ
 */
export async function getSolution(query: string): Promise<SolutionResponse> {
  try {
    // Next.js API Routeを経由 (CORS問題を回避)
    // codeIdをqueryパラメータとして送信
    const response = await fetch(`/api/solution_service/query?query=${encodeURIComponent(query)}`, {
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
 * Next.js API Routesを経由してバックエンドにアクセス
 * @param file - アップロードするファイル
 * @returns アップロード結果
 */
export async function uploadDocument(
  file: File
): Promise<UploadResponse | UploadErrorResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Next.js API Routeを経由 (CORS問題を回避)
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

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
 * @param blobName - 処理するBlobの名前
 * @param modelId - 使用するモデルID (オプション)
 * @param embeddingModel - 使用するembeddingモデル (オプション)
 * @returns 処理結果
 */
export async function processDocument(
  blobName: string,
  modelId?: string,
  embeddingModel?: string
): Promise<ProcessDocumentResponse | EmbeddingErrorResponse> {
  try {
    const response = await fetch('/api/embedding/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blob_name: blobName,
        model_id: modelId || 'prebuilt-layout',
        embedding_model: embeddingModel || 'text-embedding-3-small',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}

/**
 * Embedding Service API - 複数のドキュメントを一括処理
 * @param blobNames - 処理するBlobの名前の配列
 * @param modelId - 使用するモデルID (オプション)
 * @param embeddingModel - 使用するembeddingモデル (オプション)
 * @returns 処理結果
 */
export async function processBatchDocuments(
  blobNames: string[],
  modelId?: string,
  embeddingModel?: string
): Promise<ProcessBatchResponse | EmbeddingErrorResponse> {
  try {
    const response = await fetch('/api/embedding/process-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blob_names: blobNames,
        model_id: modelId || 'prebuilt-layout',
        embedding_model: embeddingModel || 'text-embedding-3-small',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error processing batch documents:', error);
    throw error;
  }
}

/**
 * Embedding Service API - Blob一覧を取得
 * @param prefix - フィルタリング用のプレフィックス (オプション)
 * @returns Blob一覧
 */
export async function listBlobs(
  prefix?: string
): Promise<ListBlobsResponse | EmbeddingErrorResponse> {
  try {
    const url = prefix
      ? `/api/embedding/list-blobs?prefix=${encodeURIComponent(prefix)}`
      : '/api/embedding/list-blobs';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error listing blobs:', error);
    throw error;
  }
}
