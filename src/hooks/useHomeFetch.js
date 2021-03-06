import API from "../apiSettings";
import {useState, useEffect} from "react";

const initialState = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0
};

export const useHomeFetch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [state, setState] = useState(initialState);
    const[loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const fetchMovies = async (page, term='')=>{
        try {
            setError(false);
            setLoading(true);
            const movies = await API.fetchMovies(term, page);
            console.log(movies);
            setState(prev=> ({
                ...movies,
                results:
                    page > 1 ? [...prev.results, ...movies.results] : [...movies.results]
            }))
        }
        catch (e){
            setError(true);

        }
        setLoading(false);
    };
    // Initial Render
    useEffect(()=>{
        setState(initialState);
        fetchMovies(1, searchTerm)
    }, [searchTerm]);

    useEffect(()=>{
       if(!isLoadingMore) {
        return;
       }
        fetchMovies(
            state.page + 1,
            searchTerm)
            .then(response => setIsLoadingMore(false));


    }, [isLoadingMore, searchTerm, state.page]);
     return{state: state, loading, error, searchTerm, setSearchTerm, setIsLoadingMore }
};