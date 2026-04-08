import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMembers, fetchMember, createMember, updateMember, deleteMember, importMembersCSV, fetchTracks, fetchRoles, fetchUsers, updateUserRole } from '../api/members.js';

export function useMembersList(filters) {
  return useQuery({ queryKey: ['members', filters], queryFn: () => fetchMembers(filters) });
}

export function useMember(id) {
  return useQuery({ queryKey: ['member', id], queryFn: () => fetchMember(id), enabled: !!id });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createMember, onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }) });
}

export function useImportCSV() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: importMembersCSV, onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }) });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMember(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] });
      qc.invalidateQueries({ queryKey: ['member'] });
    },
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteMember, onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }) });
}

export function useTracks() {
  return useQuery({ queryKey: ['tracks'], queryFn: fetchTracks });
}

export function useRoles() {
  return useQuery({ queryKey: ['roles'], queryFn: fetchRoles });
}

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: fetchUsers });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
