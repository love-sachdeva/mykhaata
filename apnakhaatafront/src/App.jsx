import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home            from './features/home/Home';
import AccountsList    from './features/accounts/AccountsList';
import AccountForm     from './features/accounts/AccountForm';
import DraftsList      from './features/drafts/DraftList';
import ReleaseForm     from './features/release/ReleaseForm';
import RawMaterialsList from './features/raw/RawMaterialList';
import RecipesList     from './features/recipe/RecipesList';
import RecipeForm      from './features/recipe/RecipeForm';
import AlertsDashboard from './features/alerts/AlertsDashboard';
import AccountDetail from "./features/accounts/AccountDetails";
import RawMaterialEdit from "./features/raw/RawMaterialEdit";
import RawMaterialDetail from "./features/raw/RawMaterialDetail";
import RawMaterialForm from "./features/raw/RawMaterialForm";
import RecipeEdit from "./features/recipe/RecipeEdit";
import AddressCapEdit from "./features/addressCaps/AddressCapEdit";
import AddressCapForm from "./features/addressCaps/AddressCapForm";
import AddressCapsList from "./features/addressCaps/AddessCapsList";
import BillsList from "./features/release/BillsList";
import BillForm from "./features/drafts/BillForm";
import BillEdit from "./features/drafts/BillEdit";
import AddItem from "./features/drafts/AddItem";
import FinalizeBill from "./features/release/FinalizeBill";
import FinalizeAdjustedBill from "./features/release/FinalizeAdjustedBill";
import Reports from "./features/reports/Reports";

export default function App() {
    return (
            <Routes>
                <Route path="/"             element={<Home />} />
                <Route path="/accounts"     element={<AccountsList />} />
                <Route path="/accounts/new" element={<AccountForm />} />
                <Route path="/accounts/:id" element={<AccountDetail />} />
                <Route path="/drafts"       element={<BillsList onlyDrafts={true} />} />
                <Route path="/drafts/new/add-item"   element={<AddItem />} />
                <Route path="/drafts/new"   element={<BillForm />} />
                <Route path="/bills/:id/edit" element={<BillEdit />} />
                <Route path="/bills/:id/edit/:id/add-item"  element={<AddItem />} />
                <Route path="/release"      element={<ReleaseForm />} />
                <Route path="/bills"      element={<BillsList />} />
                <Route path="/raw-materials"           element={<RawMaterialsList />} />
                <Route path="/raw-materials/new"       element={<RawMaterialForm />} />
                <Route path="/raw-materials/:id"       element={<RawMaterialDetail />} />
                <Route path="/raw-materials/:id/edit"  element={<RawMaterialEdit />} />
                <Route path="/recipes"           element={<RecipesList />} />
                <Route path="/recipes/new"       element={<RecipeForm />} />
                <Route path="/recipes/:id"       element={<RecipeEdit />} />
                <Route path="/address-caps"          element={<AddressCapsList />} />
                <Route path="/address-caps/new"      element={<AddressCapForm />} />
                <Route path="/address-caps/:city/edit" element={<AddressCapEdit />} />
                <Route path="/bills/:id/finalize" element={<FinalizeBill />} />
                <Route path="/bills/:id/finalize/adjust" element={<FinalizeAdjustedBill />} />
                <Route path="/alerts"       element={<AlertsDashboard />} />
                <Route path="/reports"       element={<Reports />} />
            </Routes>
    );
}
