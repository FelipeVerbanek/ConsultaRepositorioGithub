import React, { Component} from 'react';
import {FaGithubAlt, FaPlus, FaSpinner} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import swal from 'sweetalert'

import api from '../../services/api'
// import { Container } from './styles';
import { Form, SubmitButton, List} from './styles'
import Container from '../../components/Container'

export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false
    }

    handleInputChange = e =>{
        this.setState({newRepo: e.target.value})
    }
    handleSubmit = async e =>{
        e.preventDefault()

        this.setState({loading: true})
        const {newRepo, repositories} = this.state
        try{
            const response = await api.get(`/repos/${newRepo}`)
       

            console.log(response.status)

            const data = {
                name: response.data.full_name            
            }

            this.setState({
                repositories: [...repositories,data],
                newRepo:'',
                loading: false
            })
        }catch(error){
            console.log(error.response)
           if(error.response.status == 404){
                swal('Reposótirio não encontrado', `Repositório ${newRepo} não foi encontrado`,'error');
           }else{
                swal('Erro ao buscar repositório', error.response.statusText,'error');
           }

           this.setState({
            repositories: [...repositories],
            newRepo:'',
            loading: false
            })
        }
    }
    //Carregar os dados do localStorage
    componentDidMount(){
        const repositories = localStorage.getItem('repositories')
        if(repositories){
            this.setState({repositories: JSON.parse(repositories)})
        }

    }
    // Salvar os dados do localStorage
    componentDidUpdate(_, prevState){
        const {repositories} = this.state

        if(prevState.repositories !== repositories){
            localStorage.setItem('repositories', JSON.stringify(repositories))
        }
    }

    render() {
        const { newRepo, loading, repositories } = this.state


        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Adicionar repositório" 
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading} >
                        {
                            loading ? (<FaSpinner color="#FFFF" size={14} />) : (<FaPlus color="#fff" size={14}/>)
                        }
                        
                    </SubmitButton>
                    
                </Form>
                <List>
                    {repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
                        </li>
                    ))}
                </List>
            </Container>    
        )
    }
}
