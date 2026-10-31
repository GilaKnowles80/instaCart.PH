import { v4 as uuidv4 } from 'uuid';
import { COMPLIANCE_REQUIREMENTS, type UserKYCRole, type KYCDocument, type UserComplianceProfile, type EscrowAccount, type BusinessTransaction, type AgentDeveloperConnection, type MarketingMaterial } from './kyc.types.js';
import {
  KycDocumentRepository,
  ComplianceProfileRepository,
  EscrowAccountRepository,
  BusinessTransactionRepository,
  AgentDeveloperConnectionRepository,
  MarketingMaterialRepository,
} from '../../db/repository.js';

export class KYCComplianceService {
  static async uploadDocument(data: {
    userId: string;
    userRole: UserKYCRole;
    documentType: string;
    documentName: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    isRequired: boolean;
  }) {
    const requirements = COMPLIANCE_REQUIREMENTS[data.userRole];
    const isRequired = data.isRequired ?? (requirements?.requiredDocuments.includes(data.documentType) ?? false);

    const document = await KycDocumentRepository.create({
      id: `doc_${uuidv4()}`,
      userId: data.userId,
      userRole: data.userRole,
      documentType: data.documentType,
      documentName: data.documentName,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      status: 'pending',
      uploadedAt: new Date(),
      isRequired,
      complianceScore: 0,
    });
    await this.updateComplianceProfile(data.userId, data.userRole);
    return document;
  }

  static async getUserDocuments(userId: string) {
    return KycDocumentRepository.getByUserId(userId);
  }

  static async getAllDocuments() {
    return KycDocumentRepository.getAll();
  }

  static async reviewDocument(documentId: string, status: 'approved' | 'rejected', reviewedBy: string, rejectedReason?: string) {
    const doc = await KycDocumentRepository.review(documentId, status, reviewedBy, rejectedReason);
    if (!doc) throw new Error('Document not found');
    await this.updateComplianceProfile(doc.user_id, doc.user_role);
    return doc;
  }

  static async getComplianceProfile(userId: string) {
    return ComplianceProfileRepository.getByUserId(userId);
  }

  static async getAllComplianceProfiles() {
    return ComplianceProfileRepository.getAll();
  }

  static async updateComplianceProfile(userId: string, userRole: UserKYCRole) {
    const requirements = COMPLIANCE_REQUIREMENTS[userRole];
    const userDocs = await KycDocumentRepository.getByUserId(userId);

    const requiredDocs = requirements.requiredDocuments;
    const submittedRequired = userDocs.filter((d: any) => d.is_required && requiredDocs.includes(d.document_type));
    const approvedRequired = submittedRequired.filter((d: any) => d.status === 'approved');

    const documentsRequired = requiredDocs.length;
    const documentsSubmitted = submittedRequired.length;
    const documentsApproved = approvedRequired.length;
    const documentsRejected = userDocs.filter((d: any) => d.status === 'rejected').length;

    const compliancePercentage = documentsRequired > 0
      ? Math.round((documentsApproved / documentsRequired) * 100)
      : 0;

    const isCompliant = documentsApproved === documentsRequired;
    const canGoLive = isCompliant;

    let profile = await ComplianceProfileRepository.getByUserId(userId);
    if (profile) {
      profile = await ComplianceProfileRepository.update(userId, {
        overall_status: isCompliant ? 'approved' : 'pending',
        compliance_percentage: compliancePercentage,
        documents_submitted: documentsSubmitted,
        documents_required: documentsRequired,
        documents_approved: documentsApproved,
        documents_rejected: documentsRejected,
        is_compliant: isCompliant,
        can_go_live: canGoLive,
        last_reviewed_at: new Date(),
      });
    } else {
      profile = await ComplianceProfileRepository.create({
        id: `profile_${uuidv4()}`,
        userId,
        userRole,
        overallStatus: isCompliant ? 'approved' : 'pending',
        compliancePercentage,
        documentsSubmitted,
        documentsRequired,
        documentsApproved,
        documentsRejected,
        isCompliant,
        canGoLive,
      });
    }
    return profile;
  }

  // ==========================================
  // ESCROW ACCOUNTS
  // ==========================================
  static async createEscrowAccount(data: {
    transactionId: string;
    buyerId: string;
    sellerId: string;
    developerId?: string;
    agentId?: string;
    amount: number;
    currency?: string;
    status?: 'held' | 'released' | 'refunded' | 'disputed';
    purpose: string;
    releaseConditions?: string[];
    conditionsMent?: boolean;
    paypalTransactionId?: string;
    serviceChargeAmount?: number;
    serviceChargePaidToAdmin?: boolean;
  }) {
    const account = await EscrowAccountRepository.create({
      id: `escrow_${uuidv4()}`,
      transactionId: data.transactionId,
      buyerId: data.buyerId,
      sellerId: data.sellerId,
      developerId: data.developerId,
      agentId: data.agentId,
      amount: data.amount,
      currency: data.currency || 'PHP',
      status: data.status || 'held',
      purpose: data.purpose,
      releaseConditions: data.releaseConditions || [],
      conditionsMent: data.conditionsMent || false,
      paypalTransactionId: data.paypalTransactionId,
      serviceChargeAmount: data.serviceChargeAmount || 0,
      serviceChargePaidToAdmin: data.serviceChargePaidToAdmin || false,
    });
    return account;
  }

  static async getEscrowAccount(id: string) {
    return EscrowAccountRepository.findById(id);
  }

  static async getEscrowAccountByTransactionId(transactionId: string) {
    return EscrowAccountRepository.findByTransactionId(transactionId);
  }

  static async updateEscrowAccount(id: string, updates: any) {
    return EscrowAccountRepository.update(id, updates);
  }

  static async getAllEscrowAccounts() {
    return EscrowAccountRepository.getAll();
  }

  // ==========================================
  // BUSINESS TRANSACTIONS
  // ==========================================
  static async createBusinessTransaction(data: {
    propertyId: string;
    propertyTitle: string;
    buyerId: string;
    sellerId: string;
    developerId?: string;
    agentId?: string;
    agentCommissionAmount?: number;
    serviceChargeAmount?: number;
    totalAmount: number;
    currency?: string;
    status?: 'pending' | 'escrow_held' | 'completed' | 'refunded' | 'disputed';
    escrowAccountId?: string;
    paypalTransactionId?: string;
    adminServiceChargePaid?: boolean;
    agentCommissionPaid?: boolean;
  }) {
    const txn = await BusinessTransactionRepository.create({
      id: `txn_${uuidv4()}`,
      propertyId: data.propertyId,
      propertyTitle: data.propertyTitle,
      buyerId: data.buyerId,
      sellerId: data.sellerId,
      developerId: data.developerId,
      agentId: data.agentId,
      agentCommissionAmount: data.agentCommissionAmount || 0,
      serviceChargeAmount: data.serviceChargeAmount || 0,
      totalAmount: data.totalAmount,
      currency: data.currency || 'PHP',
      status: data.status || 'pending',
      escrowAccountId: data.escrowAccountId,
      paypalTransactionId: data.paypalTransactionId,
      adminServiceChargePaid: data.adminServiceChargePaid || false,
      agentCommissionPaid: data.agentCommissionPaid || false,
    });
    return txn;
  }

  static async getBusinessTransaction(id: string) {
    return BusinessTransactionRepository.findById(id);
  }

  static async updateBusinessTransaction(id: string, updates: any) {
    return BusinessTransactionRepository.update(id, updates);
  }

  static async getAllBusinessTransactions() {
    return BusinessTransactionRepository.getAll();
  }

  static async markAgentCommissionPaid(transactionId: string) {
    const txn = await BusinessTransactionRepository.findById(transactionId);
    if (!txn) throw new Error('Transaction not found');
    return BusinessTransactionRepository.update(transactionId, { agent_commission_paid: true });
  }

  // ==========================================
  // AGENT-DEVELOPER CONNECTIONS
  // ==========================================
  static async connectAgentToDeveloper(data: {
    agentId: string;
    developerId: string;
    commissionRate: number;
  }) {
    const existing = (await AgentDeveloperConnectionRepository.getByAgentId(data.agentId)).find(
      (c: any) => c.developer_id === data.developerId && c.connection_status === 'active'
    );
    if (existing) throw new Error('Agent already connected to this developer');

    const connection = await AgentDeveloperConnectionRepository.create({
      id: `conn_${uuidv4()}`,
      agentId: data.agentId,
      developerId: data.developerId,
      connectionStatus: 'active',
      commissionRate: data.commissionRate,
      totalCommissionEarned: 0,
    });
    return connection;
  }

  static async getAgentConnections(agentId: string) {
    return AgentDeveloperConnectionRepository.getByAgentId(agentId);
  }

  static async getDeveloperConnections(developerId: string) {
    return AgentDeveloperConnectionRepository.getByDeveloperId(developerId);
  }

  static async getAllConnections() {
    return AgentDeveloperConnectionRepository.getAll();
  }

  static async updateAgentCommissionEarned(connectionId: string, amount: number) {
    const conn = await AgentDeveloperConnectionRepository.findById(connectionId);
    if (!conn) throw new Error('Connection not found');
    return AgentDeveloperConnectionRepository.update(connectionId, {
      total_commission_earned: Number(conn.total_commission_earned) + amount,
    });
  }

  // ==========================================
  // MARKETING MATERIALS (Developer)
  // ==========================================
  static async uploadMarketingMaterial(data: {
    developerId: string;
    projectName: string;
    materialType: 'campaign' | 'banner' | 'logo' | 'claims' | 'brochure' | 'video';
    title: string;
    description?: string;
    fileUrl: string;
    fileName: string;
  }) {
    const material = await MarketingMaterialRepository.create({
      id: `mat_${uuidv4()}`,
      developerId: data.developerId,
      projectName: data.projectName,
      materialType: data.materialType,
      title: data.title,
      description: data.description,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      status: 'pending',
    });
    return material;
  }

  static getMarketingMaterials(developerId?: string) {
    if (developerId) {
      return MarketingMaterialRepository.getByDeveloperId(developerId);
    }
    return MarketingMaterialRepository.getAll();
  }

  static async reviewMarketingMaterial(materialId: string, status: 'approved' | 'rejected', reviewedBy: string) {
    const material = await MarketingMaterialRepository.findById(materialId);
    if (!material) throw new Error('Material not found');
    return MarketingMaterialRepository.update(materialId, { status, reviewed_by: reviewedBy });
  }
}