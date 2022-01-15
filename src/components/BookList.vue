<template>
	<div class="mx-auto mt-16">
		<v-row class="mx-auto">
        <v-col class="col-md-9 col-lg-10 grey lighten-3 px-md-4">
                
				<div v-if="skeLoader">
					<skeleton-loader/>
				</div>
				<v-data-table
					v-if="skeLoader == false"
					:headers="headers"
					:items="books"
					sort-by="name"
					class="elevation-1"
					:search="search"
				>   
					<template v-slot:top>
						<v-toolbar
						flat
						>
							<v-text-field
								v-model="search"
								append-icon="mdi-magnify"
								label="Search"
								single-line
								hide-details
							>
							</v-text-field>
							<v-spacer></v-spacer>
							<v-dialog v-model="dialogDelete" max-width="500px">
								<v-card>
									<v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn class="white--text" color="grey darken-3"  @click="closeDelete">Cancel</v-btn>
										<v-btn v-show="loading == false"  class="white--text" color="red lighten-2"  @click="deleteItemConfirm">OK</v-btn>
										<v-progress-circular
											v-show="loading"
											:width="3"
											class="ml-4"
											color="green"
											indeterminate
										>
										</v-progress-circular>
										<v-spacer></v-spacer>
									</v-card-actions>
								</v-card>
							</v-dialog>	
						</v-toolbar>
					</template>
		
					<template v-slot:item.actions="{ item }">
						<v-icon
							small
							class="mr-2"
							@click="switchUrl(item)"
						>
							mdi-pencil
						</v-icon>
						<v-icon
							small
								class="mr-2"
							@click="deleteItem(item)"
						>
							mdi-delete
						</v-icon>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
	</div>
</template>

<script>
	import SkeletonLoader from './SkeletonLoader';
    import Axios from 'axios';

	export default {
		components: {SkeletonLoader},
		data: () => ({
			skeLoader: false,
			loading: false,
			search: '',
			dialog: false,
			dialogDelete: false,
            books: [],
			headers: [
				{
				text: 'Name',
				align: 'start',
				sortable: false,
				value: 'name',
				},
				{ text: 'Isbn', value: 'isbn' },
				{ text: 'number_of_pages', value: 'number_of_pages' },
				{ text: 'Actions', value: 'actions', sortable: false },
			],
			editedIndex: '',
            edited:{},
			editedItem: {},
		}),

		computed: {
		
			formTitle () {
				return this.editedIndex === -1 ? 'New Item' : 'Edit Category'
			},
		},
		methods: {
			editItem (item) {
				this.editedIndex = item.id
				this.edited = item
				this.dialog = true
			},

			deleteItem (item) {
				this.editedIndex = item.id;

				this.editedItem = item;
				this.dialogDelete = true
			},
			async deleteItemConfirm () {
				this.loading = true;
				const baseUrl = process.env.VUE_APP_BASEURL;
                let response = (await Axios.delete(`${baseUrl}/api/v1/books/${this.editedIndex}`)).data;
					this.loading = false;
					let index = this.books.findIndex(b => b.id == this.editedIndex);
					this.books.splice(index, 1);
					this.$toastr.s(response.message);
				this.closeDelete()
			},
			close () {
				this.dialog = false
				
			},

			closeDelete () {
				this.dialogDelete = false
				this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
				})
			},
			async loadData(){
				const baseUrl = process.env.VUE_APP_BASEURL;
				this.skeLoader = true;
				let response = (await Axios.get(`${baseUrl}/api/v1/books`)).data;
                console.log(response)
                this.books = response.data;
				this.skeLoader = false;
			},
			switchUrl (item) {
				this.$router.push(`/book/edit/${item.id}`);
			},
		},
		created(){
			this.loadData();
		}
	}
</script>