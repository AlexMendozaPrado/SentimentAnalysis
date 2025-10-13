// Dependency Injection Container for Clean Architecture
import { OpenAISentimentAnalyzer } from '../sentiment/OpenAISentimentAnalyzer';
import { PDFTextExtractor } from '../text-extraction/PDFTextExtractor';
import { InMemorySentimentAnalysisRepository } from '../repositories/InMemorySentimentAnalysisRepository';
import { CSVExportService } from '../export/CSVExportService';

import { 
  AnalyzeSentimentUseCase,
  GetHistoricalAnalysisUseCase,
  FilterAnalysisUseCase,
  ExportAnalysisUseCase,
} from '../../core/application/use-cases';

import { SentimentAnalyzerPort } from '../../core/domain/ports/SentimentAnalyzerPort';
import { TextExtractorPort } from '../../core/domain/ports/TextExtractorPort';
import { SentimentAnalysisRepositoryPort } from '../../core/domain/ports/SentimentAnalysisRepositoryPort';
import { ExportServicePort } from '../../core/domain/ports/ExportServicePort';

export interface DIContainerConfig {
  openaiApiKey: string;
  openaiModel?: string;
  maxTokens?: number;
  temperature?: number;
  maxFileSize?: number;
  maxExportLimit?: number;
}

export class DIContainer {
  private static instance: DIContainer;
  private config: DIContainerConfig;

  // Infrastructure Layer
  private _sentimentAnalyzer?: SentimentAnalyzerPort;
  private _textExtractor?: TextExtractorPort;
  private _repository?: SentimentAnalysisRepositoryPort;
  private _exportService?: ExportServicePort;

  // Application Layer 
  private _analyzeSentimentUseCase?: AnalyzeSentimentUseCase;
  private _getHistoricalAnalysisUseCase?: GetHistoricalAnalysisUseCase;
  private _filterAnalysisUseCase?: FilterAnalysisUseCase;
  private _exportAnalysisUseCase?: ExportAnalysisUseCase;

  private constructor(config: DIContainerConfig) {
    this.config = config;
  }

  public static getInstance(config?: DIContainerConfig): DIContainer {
    if (!DIContainer.instance) {
      if (!config) {
        throw new Error('DIContainer configuration is required for first initialization');
      }
      DIContainer.instance = new DIContainer(config);
    }
    return DIContainer.instance;
  }

  public static reset(): void {
    DIContainer.instance = undefined as any;
  }

  // Infrastructure Layer Getters
  public get sentimentAnalyzer(): SentimentAnalyzerPort {
    if (!this._sentimentAnalyzer) {
      this._sentimentAnalyzer = new OpenAISentimentAnalyzer(
        this.config.openaiApiKey,
        this.config.openaiModel || 'gpt-4',
        this.config.maxTokens || 4000,
        this.config.temperature || 0.3
      );
    }
    return this._sentimentAnalyzer;
  }

  public get textExtractor(): TextExtractorPort {
    if (!this._textExtractor) {
      this._textExtractor = new PDFTextExtractor(
        this.config.maxFileSize || 10 * 1024 * 1024 // 10MB
      );
    }
    return this._textExtractor;
  }

  public get repository(): SentimentAnalysisRepositoryPort {
    if (!this._repository) {
      this._repository = new InMemorySentimentAnalysisRepository();
    }
    return this._repository;
  }

  public get exportService(): ExportServicePort {
    if (!this._exportService) {
      this._exportService = new CSVExportService(
        this.config.maxExportLimit || 10000
      );
    }
    return this._exportService;
  }

  // Application Layer Getters
  public get analyzeSentimentUseCase(): AnalyzeSentimentUseCase {
    if (!this._analyzeSentimentUseCase) {
      this._analyzeSentimentUseCase = new AnalyzeSentimentUseCase(
        this.sentimentAnalyzer,
        this.textExtractor,
        this.repository
      );
    }
    return this._analyzeSentimentUseCase;
  }

  public get getHistoricalAnalysisUseCase(): GetHistoricalAnalysisUseCase {
    if (!this._getHistoricalAnalysisUseCase) {
      this._getHistoricalAnalysisUseCase = new GetHistoricalAnalysisUseCase(
        this.repository
      );
    }
    return this._getHistoricalAnalysisUseCase;
  }

  public get filterAnalysisUseCase(): FilterAnalysisUseCase {
    if (!this._filterAnalysisUseCase) {
      this._filterAnalysisUseCase = new FilterAnalysisUseCase(
        this.repository
      );
    }
    return this._filterAnalysisUseCase;
  }

  public get exportAnalysisUseCase(): ExportAnalysisUseCase {
    if (!this._exportAnalysisUseCase) {
      this._exportAnalysisUseCase = new ExportAnalysisUseCase(
        this.repository,
        this.exportService
      );
    }
    return this._exportAnalysisUseCase;
  }

  // Utility methods
  public async validateConfiguration(): Promise<boolean> {
    try {
      // Validate OpenAI connection
      const isAnalyzerReady = await this.sentimentAnalyzer.isReady();
      if (!isAnalyzerReady) {
        console.error('OpenAI sentiment analyzer is not ready');
        return false;
      }

      // Validate other services
      const supportedFormats = this.exportService.getSupportedFormats();
      if (supportedFormats.length === 0) {
        console.error('Export service has no supported formats');
        return false;
      }

      const maxFileSize = this.textExtractor.getMaxFileSize();
      if (maxFileSize <= 0) {
        console.error('Text extractor has invalid max file size');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Configuration validation failed:', error);
      return false;
    }
  }

  public getConfiguration(): Readonly<DIContainerConfig> {
    return { ...this.config };
  }

  public updateConfiguration(updates: Partial<DIContainerConfig>): void {
    this.config = { ...this.config, ...updates };
    
    // Reset instances that depend on configuration
    this._sentimentAnalyzer = undefined;
    this._textExtractor = undefined;
    this._exportService = undefined;
    
    // Reset use cases that depend on updated infrastructure
    this._analyzeSentimentUseCase = undefined;
    this._exportAnalysisUseCase = undefined;
  }
}
