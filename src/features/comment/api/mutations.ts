import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from "../../../shared/api/baseQueries";
import { commentKeys } from "./queries";
import { Comment } from '../../../entities/comment/model';

export const useAddComment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (newComment) => fetcher({
            url: '/comments/add',
            method: 'POST',
            data: newComment,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.lists() })
        }
    })
}
  
  // fetcher의 반환 타입을 명시적으로 지정
  export const useUpdateComment = () => {
    const queryClient = useQueryClient();
  
    return useMutation<string, Error, Comment>({
      mutationFn: (selectedComment: Comment) => 
        fetcher<string>({  // 반환 타입을 명시적으로 string으로 지정
          url: `comments/${selectedComment.id}`,
          method: 'PUT',
          data: selectedComment.body
        }),
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: commentKeys.detail(data) });
      }
    });
  };