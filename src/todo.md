# Progress Tracking & Open Tasks

## 1. Data Centralization (Priority: High)
The following components currently use local mock data and need to be refactored to use `useData()` from `/components/providers/DataProvider.tsx`:

### Dashboard Components
- [ ] `OfflineSyncStatus.tsx` (Queued changes, conflicts, history)
- [ ] `ADMDashboard.tsx` (Visits, tasks, opportunities, recent customers)
- [ ] `BUCHDashboard.tsx` (Invoices, recurring tasks, audit trail)
- [ ] `KALKDashboard.tsx` (Estimates, project costs, templates, approvals)
- [ ] `PLANDashboard.tsx` (Projects, team members, milestones, delays)
- [ ] `TaskDashboard.tsx` (Tasks)

### Feature Components
- [ ] `SearchFiltersDemo.tsx` (Autocomplete results)
- [ ] `TablesDataGridsDemo.tsx` (Customer and project lists)
- [ ] `BulkImportFormDemo.tsx` (Sample CSV data)
- [ ] `ActivityTimelineDemo.tsx` (Activity lists)
- [ ] `InvoiceListDemo.tsx` (Invoice lists)
- [ ] `OpportunityPipelineDemo.tsx` (Opportunities)
- [ ] `ContactDetailView.tsx` (Single contact, locations, opportunities)
- [ ] `OpportunityDetailView.tsx` (Single opportunity data)
- [ ] `OfferList.tsx` (Offers)
- [ ] `OfferDetailView.tsx` (Single offer)
- [ ] `ContractList.tsx` (Contracts)
- [ ] `ContractDetailView.tsx` (Single contract)
- [ ] `TaskCard.tsx` (Activities, user/project tasks)
- [ ] `TaskForm.tsx` (Users, customers, opportunities, projects, milestones)
- [ ] `BusinessCardScanner.tsx` (Customers for dropdown)

## 2. DataProvider Enhancements
To support the components above, `DataProvider.tsx` needs to be expanded with:
- [ ] **Invoices**: Add `Invoice` type and mock data
- [ ] **Offers**: Add `Offer` type and mock data
- [ ] **Contracts**: Add `Contract` type and mock data
- [ ] **Users/Team Members**: Add centralized user list for assignments
- [ ] **Activities/Timeline**: Add centralized activity log
- [ ] **Opportunities**: Ensure full coverage of pipeline stages
- [ ] **Tasks**: Expand task model to support all dashboard views

## 3. Refactoring Plan
1.  **Phase 1**: Expand `DataProvider` schema and seed data.
2.  **Phase 2**: Update "List" views (`InvoiceList`, `OfferList`, etc.) to consume context.
3.  **Phase 3**: Update "Detail" views to fetch by ID from context.
4.  **Phase 4**: Update Dashboards to calculate metrics from context data.

## 4. Verification
- [ ] Verify all "Demo" components render without errors.
- [ ] Ensure data consistency across views (e.g., changing a customer name in one view updates it everywhere).
